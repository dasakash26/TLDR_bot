import asyncio
import logging
import threading
from pathlib import Path
from typing import Iterable, Sequence

from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain_community.vectorstores.chroma import Chroma

logging.basicConfig(level=logging.INFO)
CHROMA_DB_DIR = Path(__file__).parent.parent / "data_pipeline" / "chroma_db"


class VectorDB:
    _instance = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super(VectorDB, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        self._chroma_client: Chroma | None = None
        self._init_lock: asyncio.Lock | None = None
        self._initialized = True

    @property
    def client(self) -> Chroma:
        if self._chroma_client is None:
            raise RuntimeError(
                "Chroma client not initialized. Await VectorDB.initialize() first."
            )
        return self._chroma_client

    async def initialize(self) -> None:
        await self._ensure_client()

    async def get_client(self) -> Chroma:
        return await self._ensure_client()

    async def add_documents(
        self,
        documents: Sequence[Document | str],
        metadatas: Sequence[dict | None] | None = None,
    ) -> list[str]:
        try:
            chroma_client = await self._ensure_client()
            prepared_docs = self._merge_documents_with_metadata(documents, metadatas)
            doc_ids = await chroma_client.aadd_documents(prepared_docs)
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, chroma_client.persist)
            logging.info(f"Added {len(prepared_docs)} documents to Chroma vector DB.")
            return doc_ids
        except Exception as e:
            logging.error(
                f"Error adding documents to Chroma vector DB: {e}", exc_info=True
            )
            return []

    async def query(self, query_text, filter_metadata=None, top_k=5):
        try:
            chroma_client = await self._ensure_client()
            results = await chroma_client.asimilarity_search(
                query_text,
                filter=filter_metadata,
                k=top_k,
            )

            logging.info(f"Queried Chroma vector DB with text: {query_text}")
            return results
        except Exception as e:
            logging.error(f"Error querying Chroma vector DB: {e}", exc_info=True)
            return []

    async def _ensure_client(self) -> Chroma:
        if self._chroma_client is None:
            if self._init_lock is None:
                self._init_lock = asyncio.Lock()
            async with self._init_lock:
                if self._chroma_client is None:
                    loop = asyncio.get_running_loop()
                    self._chroma_client = await loop.run_in_executor(
                        None, self._create_client
                    )
                    logging.info("Chroma vector DB initialized successfully.")
        return self._chroma_client

    def _create_client(self) -> Chroma:
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        return Chroma(
            persist_directory=str(CHROMA_DB_DIR),
            embedding_function=embeddings,
        )

    @staticmethod
    def _merge_documents_with_metadata(
        documents: Sequence[Document | str],
        metadatas: Sequence[dict | None] | None,
    ) -> list[Document]:
        if metadatas is not None and len(documents) != len(metadatas):
            raise ValueError("documents and metadatas must be the same length.")

        merged_docs: list[Document] = []
        metadata_iter: Iterable[dict | None]
        if metadatas is None:
            metadata_iter = [{} for _ in documents]
        else:
            metadata_iter = metadatas

        for doc, metadata in zip(documents, metadata_iter, strict=True):
            metadata = metadata or {}
            if isinstance(doc, Document):
                merged_metadata = {**doc.metadata, **metadata}
                merged_docs.append(
                    Document(page_content=doc.page_content, metadata=merged_metadata)
                )
            else:
                merged_docs.append(Document(page_content=str(doc), metadata=metadata))

        return merged_docs

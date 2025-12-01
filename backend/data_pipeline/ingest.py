import logging as log
from pathlib import Path
from services.db_service import db
from prisma.enums import FileStatus
from langchain_unstructured import UnstructuredLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.utils import filter_complex_metadata
from services.vector_db import VectorDB


async def process_doc(
    file_path_str: str, document_id: str, folder_id: str, original_filename: str = None
):
    """
    Load -> split -> embed -> index -> store
    """
    file_path = Path(file_path_str)
    all_splits = []

    try:
        log.info(f"Starting processing for document ID: {document_id}")
        await db.file.update(
            where={"id": document_id}, data={"status": FileStatus.PROCESSING}
        )

        loader = UnstructuredLoader(file_path_str)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, add_start_index=True
        )

        all_splits = loader.load_and_split(text_splitter)
        filter_complex_metadata(all_splits, allowed_types=(str, int, float, bool))

        log.info(
            f"Loaded and split document ID {document_id} into {len(all_splits)} chunks"
        )

        # vector db is singleton
        vector_db = VectorDB()
        res = await vector_db.add_documents(
            documents=all_splits,
            metadatas=[
                {
                    "document_id": document_id,
                    "folder_id": folder_id,
                    "filename": original_filename or Path(file_path_str).name,
                }
                for _ in all_splits
            ],
        )

        if len(res) != len(all_splits):
            raise Exception(
                f"Failed to add all documents to vector DB. Expected {len(all_splits)}, got {len(res)}"
            )

        await db.filechunk.create_many(
            data=[
                {
                    "file_id": document_id,
                    "vector_id": res[i],
                    "chunkIndex": i,
                }
                for i, chunk in enumerate(all_splits)
            ]
        )

        # Update document status to 'PROCESSED'
        await db.file.update(
            where={"id": document_id}, data={"status": FileStatus.COMPLETED}
        )
        log.info(f"Completed processing for document ID: {document_id}")
    except Exception as e:
        log.error(f"Error processing document ID {document_id}: {e}", exc_info=True)
        # Update document status to 'FAILED'
        await db.file.update(
            where={"id": document_id}, data={"status": FileStatus.FAILED}
        )
    finally:
        try:
            file_path.unlink()
            log.info(f"Deleted temporary file: {file_path_str}")
        except Exception as e:
            log.error(
                f"Error deleting temporary file {file_path_str}: {e}", exc_info=True
            )

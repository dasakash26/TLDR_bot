import logging as log
from pathlib import Path
from ..services.db_service import db
from prisma.enums import FileStatus
from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.utils import filter_complex_metadata


async def process_doc(document_id: str, file_path_str: str):
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

        loader = UnstructuredFileLoader(file_path_str)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, add_start_index=True
        )

        all_splits = loader.load_and_split(text_splitter)
        filter_complex_metadata(all_splits, allowed_types=(str, int, float, bool))

        log.info(
            f"Loaded and split document ID {document_id} into {len(all_splits)} chunks"
        )

        actions = []
        chunk_metadata = []

        for i, doc_chunk in enumerate(all_splits):
            chunk_text = doc_chunk.page_content

        # Update document status to 'PROCESSED'
        await db.file.update(
            where={"id": document_id}, data={"status": FileStatus.COMPLETED}
        )
    except Exception as e:
        log.error(f"Error processing document ID {document_id}: {e}", exc_info=True)
        # Update document status to 'FAILED'
        await db.file.update(
            where={"id": document_id}, data={"status": FileStatus.FAILED}
        )

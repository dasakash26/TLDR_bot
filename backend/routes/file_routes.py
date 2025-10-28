from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Request,
    BackgroundTasks,
)
from slowapi import Limiter
from datetime import datetime, timezone
from tools.auth import get_current_user
from services.db_service import db
import logging
import re
from pathlib import Path


router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)

rate_limits = {
    "upload_file": "10/minute",
}


@router.post("/upload")
@limiter.limit(rate_limits["upload_file"])
async def upload(
    request: Request,
    background_tasks: BackgroundTasks,
    folder_id: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    user_id = user.id
    original_filename = str(file.filename)
    try:
        # check valid folder
        folder = await db.folder.find_first(
            where={"id": folder_id, "users": {"some": {"id": user_id}}}
        )
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found or access denied",
            )
    except Exception as e:
        logging.error(
            f"Error checking folder {folder_id} for user {user_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while accessing the folder.",
        )
    try:
        base_dir = Path(__file__).parent.parent
        temp_dir = base_dir / "data_pipeline" / "temp" / user_id
        temp_dir.mkdir(parents=True, exist_ok=True)

        safe_base = re.sub(r"[^a-zA-Z0-9._-]", "_", Path(original_filename).stem)
        extension = Path(original_filename).suffix
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        unique_filename = f"{safe_base}_{timestamp}{extension}"
        file_location = temp_dir / unique_filename

        logging.debug(f"Attempting to save file to: {file_location}")
        content = await file.read()
        with open(file_location, "wb") as buffer:
            buffer.write(content)

        logging.info(f"Successfully saved file for user {user_id} to {file_location}")
        res = await db.file.create(
            data={
                "folder_id": folder_id,
                "uploader_id": user_id,
                "filename": original_filename,
            }
        )

    except Exception as e:
        logging.error(
            f"Unexpected error saving file {original_filename} for user {user_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while saving the file.",
        )

    background_tasks.add_task(process_file, file_path=file_location, document_id=res.id)
    return {
        "file_id": res.id,
        "filename": original_filename,
        "status": "PENDING",
        "uploaded_at": res.createdAt,
    }


# file status route
@router.get("/status/{file_id}")
async def file_status(file_id: str, user=Depends(get_current_user)):
    if not file_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File ID is required",
        )

    # Retrieve the file record from the database
    file_record = await db.file.find_unique(where={"id": file_id})

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return {
        "file_id": file_record.id,
        "filename": file_record.filename,
        "status": file_record.status,
        "uploaded_at": file_record.createdAt,
        "processed_at": file_record.updatedAt,
    }

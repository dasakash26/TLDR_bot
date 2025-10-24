from fastapi import APIRouter, Depends, HTTPException, status
from slowapi import Limiter
from fastapi import Request, UploadFile, File
from datetime import datetime, timezone
from tools.auth import get_current_user
from services.db_service import db

router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)

rate_limits = {
    "upload_file": "10/minute",
}


@router.post("/upload")
@limiter.limit(rate_limits["upload_file"])
async def upload(
    request: Request, user=Depends(get_current_user), buffer: UploadFile = File(...)
):
    """
    - Upload a file associated with the authenticated user.
    - Store the fle, create db record with status PENDING.
    - Trigger background processing task.
    - Return file metadata and processing status.
    """
    # Save file to storage (e.g., local disk, cloud storage)
    file_name = buffer.filename

    if not file_name:
        file_name = f"upload_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    file_location = f"files/{user.email}/{buffer.filename}"

    with open(file_location, "wb") as f:
        content = await buffer.read()
        f.write(content)

    # Create a database record for the uploaded file
    file_record = None
    try:
        file_record = await db.file.create(
            data={
                "user_id": user.id,
                "filename": file_name,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create file record",
        )

    # TODO: Trigger background processing task to process the file
    return {
        "file_id": file_record.id,
        "filename": file_record.filename,
        "status": file_record.status,
        "uploaded_at": file_record.createdAt,
    }


# file status route
@router.get("/status/{file_id}")
async def file_status(file_id: int, user=Depends(get_current_user)):
    if not file_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File ID is required",
        )

    # Retrieve the file record from the database
    file_record = await db.file.find_unique(where={"id": file_id, "user_id": user.id})

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

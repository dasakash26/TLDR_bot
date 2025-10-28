from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, status, Path
from slowapi import Limiter
from services.db_service import db
import logging
from tools.auth import get_current_user

router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)

rate_limits = {
    "create_folder": "10/minute",
    "get_folders": "20/minute",
    "add_user": "5/minute",
}


# Create Folder
@router.post("/")
@limiter.limit(rate_limits["create_folder"])
async def create_folder(
    request: Request, folder_name: str, user=Depends(get_current_user)
):
    user_id = user.id
    try:
        res = await db.folder.create(
            data={
                "created_by": user_id,
                "name": folder_name,
                "users": {"connect": {"id": user.id}},
            }
        )
        return {"folder_id": res.id, "name": res.name, "created_by": res.created_by}

    except Exception as e:
        logging.error(f"Error creating folder for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Get Folders
@router.get("/")
@limiter.limit(rate_limits["get_folders"])
async def get_folders(request: Request, user=Depends(get_current_user)):
    user_id = user.id
    try:
        folders = await db.folder.find_many(where={"users": {"some": {"id": user_id}}})
        return [
            {"folder_id": f.id, "name": f.name, "created_by": f.created_by}
            for f in folders
        ]

    except Exception as e:
        logging.error(f"Error retrieving folders for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Add User
@router.post("/{folder_id}/add_user")
@limiter.limit(rate_limits["add_user"])
async def add_user(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
    new_user_email: str,
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        folder = await db.folder.find_unique(where={"id": folder_id})
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found"
            )

        if folder.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the folder creator can add users",
            )

        new_user = await db.user.find_unique(where={"email": new_user_email})
        if not new_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        await db.folder.update(
            where={"id": folder_id}, data={"users": {"connect": [{"id": new_user.id}]}}
        )

        return {"message": f"User {new_user_email} added to folder {folder_id}"}

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error adding user to folder {folder_id} by user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Get files
@router.get("/{folder_id}/files")
@limiter.limit(rate_limits["get_folders"])
async def get_files(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        folder = await db.folder.find_unique(
            where={"id": folder_id}, include={"files": True, "users": True}
        )
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found"
            )

        if not folder.files or folder.users is None:
            return []

        if not any(u.id == user_id for u in folder.users):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this folder",
            )

        return [
            {"file_id": f.id, "file_name": f.filename, "uploaded_by": f.uploader_id}
            for f in folder.files
        ]

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(
            f"Error retrieving files for folder {folder_id} by user {user_id}: {e}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

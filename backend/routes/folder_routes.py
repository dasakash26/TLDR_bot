from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, status, Path
from slowapi import Limiter
from services.db_service import db
import logging
from tools.auth import get_current_user
from .models import UpdateFolderReq

router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)

rate_limits = {
    "create_folder": "10/minute",
    "get_folders": "20/minute",
    "add_user": "5/minute",
}


# Create Folder
@limiter.limit(rate_limits["create_folder"])
@router.post("/")
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
        return {"id": res.id, "name": res.name, "createdBy": res.created_by, "createdAt": res.createdAt}

    except Exception as e:
        logging.error(f"Error creating folder for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Get Folders
@limiter.limit(rate_limits["get_folders"])
@router.get("/")
async def get_folders(request: Request, user=Depends(get_current_user)):
    user_id = user.id
    try:
        folders = await db.folder.find_many(
            where={"users": {"some": {"id": user_id}}},
            include={
                "files": {"order_by": {"updatedAt": "desc"}},
                "threads": {"order_by": {"updatedAt": "desc"}},
            },
            order={"updatedAt": "desc"},
        )
        return [
            {
                "id": f.id,
                "name": f.name,
                "createdBy": f.created_by,
                "createdAt": f.createdAt,
                "updatedAt": f.updatedAt,
                "files": [
                    {
                        "id": file.id,
                        "filename": file.filename,
                        "uploaderId": file.uploader_id,
                        "status": file.status,
                        "createdAt": file.createdAt,
                    }
                    for file in f.files
                ],
                "threads": [
                    {
                        "id": thread.id,
                        "name": thread.name,
                        "createdAt": thread.createdAt,
                        "updatedAt": thread.updatedAt,
                    }
                    for thread in f.threads
                ],
            }
            for f in folders
        ]

    except Exception as e:
        logging.error(f"Error retrieving folders for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Get Single Folder
@limiter.limit(rate_limits["get_folders"])
@router.get("/{folder_id}")
async def get_folder(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        folder = await db.folder.find_unique(
            where={"id": folder_id},
            include={
                "files": {"order_by": {"updatedAt": "desc"}},
                "threads": {"order_by": {"updatedAt": "desc"}},
                "users": True,
            },
        )
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found"
            )

        if not any(u.id == user_id for u in folder.users):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this folder",
            )

        return {
            "id": folder.id,
            "name": folder.name,
            "createdBy": folder.created_by,
            "createdAt": folder.createdAt,
            "updatedAt": folder.updatedAt,
            "files": [
                {
                    "id": file.id,
                    "filename": file.filename,
                    "uploaderId": file.uploader_id,
                    "status": file.status,
                    "createdAt": file.createdAt,
                }
                for file in folder.files
            ],
            "threads": [
                {
                    "id": thread.id,
                    "name": thread.name,
                    "createdAt": thread.createdAt,
                    "updatedAt": thread.updatedAt,
                }
                for thread in folder.threads
            ],
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error retrieving folder {folder_id} by user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Add User
@limiter.limit(rate_limits["add_user"])
@router.post("/{folder_id}/add_user")
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


# delete folder
@limiter.limit(rate_limits["get_folders"])
@router.delete("/{folder_id}")
async def delete_folder(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
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
                detail="Only the folder creator can delete the folder",
            )

        await db.folder.delete(where={"id": folder_id})

        return {"message": f"Folder {folder_id} deleted successfully"}

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error deleting folder {folder_id} by user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


# Get files
@limiter.limit(rate_limits["get_folders"])
@router.get("/{folder_id}/files")
async def get_files(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        folder = await db.folder.find_unique(
            where={"id": folder_id},
            include={
                "files": {"order_by": {"updatedAt": "desc"}},
                "users": True,
            },
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
            {"id": f.id, "filename": f.filename, "uploaderId": f.uploader_id, "status": f.status, "createdAt": f.createdAt}
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


# Update Folder
@limiter.limit(rate_limits["create_folder"])
@router.put("/{folder_id}")
async def update_folder(
    request: Request,
    folder_id: Annotated[str, Path(title="Folder ID")],
    data: UpdateFolderReq,
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
                detail="Only the folder creator can update the folder",
            )

        updated_folder = await db.folder.update(
            where={"id": folder_id}, data={"name": data.new_name}
        )

        return {"id": updated_folder.id, "name": updated_folder.name, "createdBy": updated_folder.created_by, "updatedAt": updated_folder.updatedAt}

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error updating folder {folder_id} by user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

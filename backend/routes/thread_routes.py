from langchain_core.messages import HumanMessage
from langgraph.graph.state import RunnableConfig
from prisma.enums import ROLE
from services.db_service import db
from fastapi import HTTPException, Request, status
import logging
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from slowapi import Limiter
import json

from tools.auth import get_current_user
from agent.executor import agent


router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)

rate_limits = {
    "chreat_thread": "30/minute",
    "get_threads": "60/minute",
    "update_thread": "20/minute",
    "delete_thread": "20/minute",
    "chat": "20/minute",
}


@limiter.limit(rate_limits["chreat_thread"])
@router.post("/")
async def create_thread(
    request: Request,
    folder_id: str,
    thread_name: str = "New Thread",
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        res = await db.thread.create(
            data={
                "name": thread_name,
                "folder_id": folder_id,
            }
        )

        return {"thread_id": res.id, "name": res.name}
    except Exception as e:
        logging.error(f"Error creating thread for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@limiter.limit(rate_limits["get_threads"])
@router.get("/all")
async def get_threads(request: Request, folder_id: str, user=Depends(get_current_user)):
    logging.debug(user)
    user_id = user.id
    try:
        folder = await db.folder.find_first(
            include={"threads": True},
            where={
                "id": folder_id,
                "users": {"some": {"id": user_id}},
            },
        )
        logging.info(
            f"Fetched threads for user {user_id} in folder {folder_id}: {folder}"
        )
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found"
            )

        return {"threads": folder.threads}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching threads for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@limiter.limit(rate_limits["get_threads"])
@router.get("/{thread_id}")
async def get_thread(request: Request, thread_id: str, user=Depends(get_current_user)):
    user_id = user.id
    try:
        thread = await db.thread.find_first(
            include={"messages": True},
            where={
                "id": thread_id,
                "folder": {"is": {"users": {"some": {"id": user_id}}}},
            },
        )

        logging.info(f"Fetched thread for user {user_id}: {thread}")
        if not thread:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found"
            )

        return {"thread": thread}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching thread {thread_id} for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@limiter.limit(rate_limits["update_thread"])
@router.put("/{thread_id}")
async def update_thread(
    request: Request,
    thread_id: str,
    new_name: str,
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        thread = await db.thread.find_unique(
            where={"id": thread_id},
            include={"folder": {"include": {"users": True}}},
        )

        if not thread or not thread.folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found"
            )

        owners = thread.folder.users or []
        if not any(u.id == user_id for u in owners):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this thread",
            )

        updated_thread = await db.thread.update(
            where={"id": thread_id},
            data={"name": new_name},
        )

        if not updated_thread:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update thread",
            )

        return {"thread_id": updated_thread.id, "name": updated_thread.name}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating thread {thread_id} for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@limiter.limit(rate_limits["delete_thread"])
@router.delete("/{thread_id}")
async def delete_thread(
    request: Request,
    thread_id: str,
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        thread = await db.thread.find_unique(
            where={"id": thread_id},
            include={"folder": {"include": {"users": True}}},
        )

        if not thread or not thread.folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found"
            )

        owners = thread.folder.users or []
        if not any(u.id == user_id for u in owners):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this thread",
            )

        await db.thread.delete(where={"id": thread_id})

        return {"detail": "Thread deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting thread {thread_id} for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@limiter.limit(rate_limits["chat"])
@router.post("/{thread_id}/chat")
async def chat_in_thread(
    request: Request,
    thread_id: str,
    message: str,
    user=Depends(get_current_user),
):
    user_id = user.id
    try:
        thread = await db.thread.find_unique(
            where={"id": thread_id},
            include={"folder": {"include": {"users": True}}},
        )

        if not thread or not thread.folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found"
            )

        owners = thread.folder.users or []
        if not any(u.id == user_id for u in owners):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to chat in this thread",
            )

        config = RunnableConfig(
            configurable={
                "thread_id": thread_id,
                "user_id": user_id,
                "folder_id": thread.folder.id,
            }
        )

        async def stream_response():
            full_response = ""
            try:
                await db.message.create(
                    data={
                        "content": message,
                        "role": ROLE.USER,
                        "chat_id": thread_id,
                    }
                )

                async for chunk in agent.astream(
                    {"messages": [HumanMessage(content=message)]},
                    stream_mode="values",
                    config=config,
                ):
                    if "messages" in chunk:
                        messages = chunk["messages"]
                        if messages and len(messages) > 0:
                            last_message = messages[-1]
                            if (
                                hasattr(last_message, "content")
                                and last_message.type == "ai"
                            ):
                                full_response = last_message.content
                                data = {
                                    "type": "message",
                                    "content": last_message.content,
                                }
                                yield f"data: {json.dumps(data)}\n\n"

                if full_response:
                    await db.message.create(
                        data={
                            "content": full_response,
                            "role": ROLE.AI,
                            "chat_id": thread_id,
                        }
                    )
                    logging.info(f"Saved messages to database for thread {thread_id}")

                yield f"data: {json.dumps({'type': 'done'})}\n\n"

            except Exception as e:
                logging.error(f"Error in stream for thread {thread_id}: {e}")
                error_data = {"type": "error", "message": str(e)}
                yield f"data: {json.dumps(error_data)}\n\n"

        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in chat endpoint for thread {thread_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

import logging
from fastapi import HTTPException, Request, status
from jose import jwt
from services.db_service import db
from core.config import settings
import bcrypt
import hashlib

SECRET_KEY = settings.secret_key
JWT_ALGO = settings.jwt_algo


async def get_current_user(request: Request):
    # get from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    user_id = None
    try:
        payload = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=[JWT_ALGO])
        user_id = payload.get("sub")
    except Exception as e:
        logging.error(f"Token decode error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    logging.info(f"Authenticated user: {user.email}")
    return user


def hash_secret(secret: str) -> str:
    pre_hashed = hashlib.sha256(secret.encode()).hexdigest()
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pre_hashed.encode(), salt).decode()


def verify_secret(secret: str, hashed: str) -> bool:
    pre_hashed = hashlib.sha256(secret.encode()).hexdigest()
    return bcrypt.checkpw(pre_hashed.encode(), hashed.encode())

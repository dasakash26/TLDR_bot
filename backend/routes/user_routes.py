from fastapi import APIRouter
from core.config import settings
from .models import SignupReq

SECRET_KEY = settings.secret_key

router = APIRouter()


@router.post("/signup")
async def signup(data: SignupReq):
    # existing user check
    # existing_user = await
    pass

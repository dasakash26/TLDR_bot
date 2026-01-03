from fastapi import Depends
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import Response
from core.config import settings
from .models import LoginReq, SignupReq as registerReq, VerificationReq, ResendOtpReq
from tools.otp_gen import gen_otp
from services.db_service import db
import logging
from jose import jwt
from slowapi import Limiter
from tools.auth import get_current_user, hash_secret, verify_secret

SECRET_KEY = settings.secret_key
JWT_ALGO = settings.jwt_algo
OTP_EXPIRY_TIME = 24

router = APIRouter()
limiter = Limiter(key_func=lambda request: request.client.host)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


@limiter.limit("5/minute")
@router.post("/register")
async def register(request: Request, data: registerReq):
    # existing user check
    existing_user = await db.user.find_unique(where={"email": data.email})

    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    # gen otp and hash
    plain_otp = gen_otp()
    hashed_otp = hash_secret(plain_otp)
    hashed_pwd = hash_secret(data.password)

    # save to db
    if existing_user:
        try:
            await db.user.update(
                where={"email": data.email},
                data={
                    "name": data.name,
                    "password": hashed_pwd,
                    "otp": hashed_otp,
                },
            )
        except Exception as e:
            logging.error(f"Error updating user: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )
    else:
        try:
            await db.user.create(
                data={
                    "name": data.name,
                    "email": data.email,
                    "password": hashed_pwd,
                    "otp": hashed_otp,
                }
            )
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    # send mail with otp
    logging.info(f"OTP for {data.email} is {plain_otp}")
    return {"message": "register successful. Please verify your email."}


@limiter.limit("5/minute")
@router.post("/verify")
async def verify(request: Request, data: VerificationReq):
    user = await db.user.find_unique(where={"email": data.email})

    if not user or not user.otp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User or OTP not found"
        )

    time_passed = datetime.now(timezone.utc) - user.updatedAt

    if time_passed.total_seconds() / 3600 > OTP_EXPIRY_TIME:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired"
        )

    is_valid = verify_secret(data.otp, user.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP"
        )

    await db.user.update(
        where={"email": data.email},
        data={"is_verified": True, "otp": None},
    )

    return {"message": "Email verified successfully."}


@limiter.limit("10/minute")
@router.post("/login")
async def login(request: Request, data: LoginReq, res: Response):
    user = await db.user.find_first(where={"email": data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    if not verify_secret(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Account not verified"
        )

    token_payload = {
        "sub": user.id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
    }

    access_token = jwt.encode(token_payload, SECRET_KEY, algorithm=JWT_ALGO)
    res.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite="strict",
        secure=True,
    )
    return {"message": "Login successful."}


@limiter.limit("20/minute")
@router.get("/me")
async def me(request: Request, current_user=Depends(get_current_user)):
    # remove sensitive info
    user_data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
        "createdAt": current_user.createdAt,
        "updatedAt": current_user.updatedAt,
    }
    logging.info(f"User data retrieved for user ID {current_user.id}")
    return user_data


@limiter.limit("10/minute")
@router.post("/logout")
async def logout(
    request: Request, res: Response, current_user=Depends(get_current_user)
):
    res.delete_cookie(key="access_token")
    return {"message": "Logout successful."}


@limiter.limit("3/minute")
@router.post("/resend-otp")
async def resend_otp(request: Request, data: ResendOtpReq):
    user = await db.user.find_unique(where={"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")

    # Gen new OTP
    plain_otp = gen_otp()
    hashed_otp = hash_secret(plain_otp)

    await db.user.update(where={"email": data.email}, data={"otp": hashed_otp})
    logging.info(f"OTP for {data.email} is {plain_otp}")
    return {"message": "OTP resent successfully"}

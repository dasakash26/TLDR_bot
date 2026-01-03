from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class SignupReq(BaseModel):
    name: Optional[str] = Field(default=None, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginReq(BaseModel):
  email: str = Field(
        min_length=3, max_length=50, description="Username or email address for login."
    )
  password: str = Field(min_length=8)


class VerificationReq(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6, description="OTP should have len 6")


class ResendOtpReq(BaseModel):
    email: EmailStr


class ChatReq(BaseModel):
    message: str


class CreateThreadReq(BaseModel):
    folder_id: str
    thread_name: str = "New Thread"


class UpdateThreadReq(BaseModel):
    new_name: str


class UpdateFolderReq(BaseModel):
    new_name: str


class ShareFolderReq(BaseModel):
    user_email: EmailStr


class RemoveUserReq(BaseModel):
    user_email: EmailStr

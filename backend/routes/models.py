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

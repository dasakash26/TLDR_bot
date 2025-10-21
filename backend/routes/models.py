from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class SignupReq(BaseModel):
    full_name: Optional[str] = Field(default=None, max_length=50)
    username: str = Field(min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginReq(BaseModel):
    username_or_email: str = Field(
        min_length=3, max_length=50, description="Username or email address for login."
    )
    password: str = Field(min_length=8)

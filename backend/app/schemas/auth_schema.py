from pydantic import BaseModel, EmailStr, Field

from app.schemas.user_schema import UserRead


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthMessage(BaseModel):
    detail: str


class AuthResponse(BaseModel):
    detail: str
    user: UserRead

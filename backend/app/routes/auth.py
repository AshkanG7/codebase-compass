from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth_schema import AuthMessage, AuthResponse, LoginRequest, SignupRequest
from app.schemas.user_schema import UserRead
from app.services.auth_service import authenticate_user, signup_user
from app.utils.security import clear_auth_cookie, set_auth_cookie


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, response: Response, db: Session = Depends(get_db_session)) -> AuthResponse:
    user, token = signup_user(db, request)
    set_auth_cookie(response, token)
    return AuthResponse(detail="Signup successful.", user=UserRead.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db_session)) -> AuthResponse:
    user, token = authenticate_user(db, request)
    set_auth_cookie(response, token)
    return AuthResponse(detail="Login successful.", user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/logout", response_model=AuthMessage)
def logout(response: Response) -> AuthMessage:
    clear_auth_cookie(response)
    return AuthMessage(detail="Logout successful.")

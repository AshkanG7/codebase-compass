from fastapi import APIRouter, status

from app.schemas.auth_schema import AuthMessage, LoginRequest, RegisterRequest


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthMessage, status_code=status.HTTP_501_NOT_IMPLEMENTED)
def register(request: RegisterRequest) -> AuthMessage:
    return AuthMessage(detail="Registration is not implemented in Phase 1.")


@router.post("/login", response_model=AuthMessage, status_code=status.HTTP_501_NOT_IMPLEMENTED)
def login(request: LoginRequest) -> AuthMessage:
    return AuthMessage(detail="Login is not implemented in Phase 1.")

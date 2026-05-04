from app.schemas.auth_schema import AuthMessage, LoginRequest, RegisterRequest


def register_user(request: RegisterRequest) -> AuthMessage:
    return AuthMessage(detail="Registration is not implemented in Phase 1.")


def authenticate_user(request: LoginRequest) -> AuthMessage:
    return AuthMessage(detail="Login is not implemented in Phase 1.")

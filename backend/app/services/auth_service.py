from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schema import LoginRequest, SignupRequest
from app.utils.security import create_access_token, hash_password, verify_password


def signup_user(db: Session, request: SignupRequest) -> tuple[User, str]:
    normalized_email = request.email.lower()
    existing_user = db.execute(select(User).where(User.email == normalized_email)).scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create account.",
        )

    user = User(
        email=normalized_email,
        hashed_password=hash_password(request.password),
        display_name=request.display_name,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create account.",
        ) from None
    db.refresh(user)
    return user, create_access_token(subject=str(user.id))


def authenticate_user(db: Session, request: LoginRequest) -> tuple[User, str]:
    normalized_email = request.email.lower()
    user = db.execute(select(User).where(User.email == normalized_email)).scalar_one_or_none()
    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return user, create_access_token(subject=str(user.id))

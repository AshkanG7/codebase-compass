from collections.abc import Generator

from fastapi import Cookie, Depends, Header, HTTPException, status
from jwt import InvalidTokenError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.models.user import User
from app.utils.security import ACCESS_TOKEN_COOKIE_NAME, decode_access_token


def get_db() -> Generator[Session, None, None]:
    yield from get_db_session()


def get_current_user(
    db: Session = Depends(get_db),
    access_token: str | None = Cookie(default=None, alias=ACCESS_TOKEN_COOKIE_NAME),
    authorization: str | None = Header(default=None),
) -> User:
    token = access_token or _get_bearer_token(authorization)
    if not token:
        raise _credentials_exception()

    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub", ""))
    except (InvalidTokenError, ValueError, TypeError):
        raise _credentials_exception() from None

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise _credentials_exception()
    return user


def _get_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token


def _credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
        headers={"WWW-Authenticate": "Bearer"},
    )

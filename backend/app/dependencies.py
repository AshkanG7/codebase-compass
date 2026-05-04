from collections.abc import Generator

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db_session


def get_db() -> Generator[Session, None, None]:
    yield from get_db_session()


def get_current_user_placeholder() -> None:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Authentication is not implemented in Phase 1.",
    )

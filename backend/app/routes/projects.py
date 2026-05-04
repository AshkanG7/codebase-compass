from fastapi import APIRouter, Depends, status

from app.dependencies import get_current_user
from app.models.user import User


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def list_projects(current_user: User = Depends(get_current_user)) -> dict[str, str | int]:
    return {"detail": "Project routes are placeholders in Phase 1."}


@router.post("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def create_project(current_user: User = Depends(get_current_user)) -> dict[str, str | int]:
    return {"detail": "Project creation is not implemented in Phase 1."}

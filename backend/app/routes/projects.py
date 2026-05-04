from fastapi import APIRouter, status


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def list_projects() -> dict[str, str]:
    return {"detail": "Project routes are placeholders in Phase 1."}


@router.post("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def create_project() -> dict[str, str]:
    return {"detail": "Project creation is not implemented in Phase 1."}

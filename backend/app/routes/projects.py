from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.code_file_schema import CodeFileRead, CodeFileUploadRequest, CodeFileUploadResponse
from app.schemas.analysis_schema import AnalysisRead
from app.schemas.project_schema import PaginatedProjects, ProjectCreate, ProjectDetail, ProjectRead
from app.services.project_service import (
    add_code_files,
    create_project as create_project_service,
    delete_project as delete_project_service,
    get_latest_analysis,
    get_project_by_id,
    get_total_pages,
    list_project_files,
    list_projects as list_projects_service,
)


router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    request: ProjectCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> ProjectRead:
    project = create_project_service(db, current_user, request)
    return ProjectRead.model_validate(project)


@router.get("", response_model=PaginatedProjects)
def list_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> PaginatedProjects:
    projects, total = list_projects_service(db, current_user, page, page_size)
    return PaginatedProjects(
        items=[ProjectRead.model_validate(project) for project in projects],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=get_total_pages(total, page_size),
    )


@router.get("/{project_id}", response_model=ProjectDetail)
def get_project(
    project_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> ProjectDetail:
    project = get_project_by_id(db, current_user, project_id)
    files = list_project_files(db, current_user, project_id)
    latest_analysis = get_latest_analysis(db, project.id)
    return ProjectDetail(
        **ProjectRead.model_validate(project).model_dump(),
        files=[CodeFileRead.model_validate(code_file) for code_file in files],
        latest_analysis=AnalysisRead.model_validate(latest_analysis) if latest_analysis else None,
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> None:
    delete_project_service(db, current_user, project_id)


@router.post("/{project_id}/files", response_model=CodeFileUploadResponse, status_code=status.HTTP_201_CREATED)
def add_project_files(
    project_id: int,
    request: CodeFileUploadRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> CodeFileUploadResponse:
    files = add_code_files(db, current_user, project_id, request.files)
    return CodeFileUploadResponse(files=[CodeFileRead.model_validate(code_file) for code_file in files])


@router.get("/{project_id}/files", response_model=list[CodeFileRead])
def get_project_files(
    project_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> list[CodeFileRead]:
    files = list_project_files(db, current_user, project_id)
    return [CodeFileRead.model_validate(code_file) for code_file in files]

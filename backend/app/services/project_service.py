from math import ceil

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.code_file import CodeFile
from app.models.project import Project
from app.models.user import User
from app.schemas.code_file_schema import CodeFileCreate
from app.schemas.project_schema import ProjectCreate
from app.utils.file_safety import MAX_FILES_PER_PROJECT, MAX_TOTAL_PROJECT_SIZE_BYTES
from app.utils.secret_scanner import redact_secrets
from app.utils.validators import validate_uploaded_file


def create_project(db: Session, current_user: User, request: ProjectCreate) -> Project:
    project = Project(
        user_id=current_user.id,
        name=request.name.strip(),
        description=request.description,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session, current_user: User, page: int, page_size: int) -> tuple[list[Project], int]:
    offset = (page - 1) * page_size
    total = db.scalar(select(func.count(Project.id)).where(Project.user_id == current_user.id)) or 0
    projects = db.execute(
        select(Project)
        .where(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc(), Project.id.desc())
        .offset(offset)
        .limit(page_size)
    ).scalars().all()
    return list(projects), total


def get_project_by_id(db: Session, current_user: User, project_id: int) -> Project:
    project = db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    ).scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return project


def get_latest_analysis(db: Session, project_id: int) -> Analysis | None:
    return db.execute(
        select(Analysis)
        .where(Analysis.project_id == project_id)
        .order_by(Analysis.created_at.desc(), Analysis.id.desc())
        .limit(1)
    ).scalar_one_or_none()


def delete_project(db: Session, current_user: User, project_id: int) -> None:
    project = get_project_by_id(db, current_user, project_id)
    db.delete(project)
    db.commit()


def add_code_files(
    db: Session,
    current_user: User,
    project_id: int,
    files: list[CodeFileCreate],
) -> list[CodeFile]:
    project = get_project_by_id(db, current_user, project_id)
    existing_count, existing_total_size = _get_file_totals(db, project.id)
    if existing_count + len(files) > MAX_FILES_PER_PROJECT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Projects may include at most {MAX_FILES_PER_PROJECT} files.",
        )

    existing_paths = set(
        db.execute(select(CodeFile.path).where(CodeFile.project_id == project.id)).scalars().all()
    )
    normalized_paths: set[str] = set()
    validated_files: list[tuple[CodeFileCreate, str, str, int, str]] = []
    incoming_total_size = 0

    for incoming_file in files:
        try:
            normalized_path, extension, size_bytes = validate_uploaded_file(
                incoming_file.path,
                incoming_file.content,
            )
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from None

        if normalized_path in existing_paths or normalized_path in normalized_paths:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate file paths are not allowed.",
            )

        redacted_content, _findings = redact_secrets(incoming_file.content)
        normalized_paths.add(normalized_path)
        incoming_total_size += size_bytes
        validated_files.append((incoming_file, normalized_path, extension, size_bytes, redacted_content))

    if existing_total_size + incoming_total_size > MAX_TOTAL_PROJECT_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Projects may include at most {MAX_TOTAL_PROJECT_SIZE_BYTES} bytes.",
        )

    code_files = [
        CodeFile(
            project_id=project.id,
            path=normalized_path,
            language=incoming_file.language,
            extension=extension,
            size_bytes=size_bytes,
            content=redacted_content,
        )
        for incoming_file, normalized_path, extension, size_bytes, redacted_content in validated_files
    ]
    db.add_all(code_files)
    db.commit()
    for code_file in code_files:
        db.refresh(code_file)
    return code_files


def list_project_files(db: Session, current_user: User, project_id: int) -> list[CodeFile]:
    project = get_project_by_id(db, current_user, project_id)
    return list(
        db.execute(
            select(CodeFile)
            .where(CodeFile.project_id == project.id)
            .order_by(CodeFile.path.asc(), CodeFile.id.asc())
        ).scalars().all()
    )


def get_total_pages(total: int, page_size: int) -> int:
    return ceil(total / page_size) if total else 0


def _get_file_totals(db: Session, project_id: int) -> tuple[int, int]:
    count = db.scalar(select(func.count(CodeFile.id)).where(CodeFile.project_id == project_id)) or 0
    total_size = db.scalar(select(func.coalesce(func.sum(CodeFile.size_bytes), 0)).where(CodeFile.project_id == project_id)) or 0
    return int(count), int(total_size)

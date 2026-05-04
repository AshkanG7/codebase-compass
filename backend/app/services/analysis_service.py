from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.code_file import CodeFile
from app.models.user import User
from app.services.ai_service import AIInvalidResponseError, AIServiceError, analyze_codebase
from app.services.project_service import get_project_by_id, list_project_files


def analyze_project(db: Session, current_user: User, project_id: int) -> Analysis:
    project = get_project_by_id(db, current_user, project_id)
    files = list_project_files(db, current_user, project.id)
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project must contain at least one file before analysis.",
        )

    analysis = Analysis(project_id=project.id, status="running")
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    try:
        result = analyze_codebase([_code_file_to_payload(code_file) for code_file in files])
    except AIInvalidResponseError as exc:
        _mark_failed(db, analysis, "OpenAI returned invalid analysis JSON.")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=analysis.error_message) from exc
    except AIServiceError as exc:
        _mark_failed(db, analysis, exc.message)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=analysis.error_message) from exc

    analysis.status = "completed"
    analysis.error_message = None
    analysis.summary = result["summary"]
    analysis.detected_stack = result["detected_stack"]
    analysis.architecture = result["architecture"]
    analysis.important_files = result["important_files"]
    analysis.how_to_run = result["how_to_run"]
    analysis.data_flow = result["data_flow"]
    analysis.risky_or_confusing_parts = result["risky_or_confusing_parts"]
    analysis.first_files_to_read = result["first_files_to_read"]
    analysis.suggested_next_steps = result["suggested_next_steps"]
    db.commit()
    db.refresh(analysis)
    return analysis


def _code_file_to_payload(code_file: CodeFile) -> dict:
    return {
        "path": code_file.path,
        "language": code_file.language,
        "content": code_file.content,
    }


def _mark_failed(db: Session, analysis: Analysis, message: str) -> None:
    analysis.status = "failed"
    analysis.error_message = message
    db.commit()
    db.refresh(analysis)

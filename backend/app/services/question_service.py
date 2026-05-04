from math import ceil

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.code_file import CodeFile
from app.models.question import Question
from app.models.user import User
from app.schemas.analysis_schema import AnalysisRead
from app.services.ai_service import AIInvalidResponseError, AIServiceError, answer_codebase_question
from app.services.project_service import get_project_by_id, list_project_files


def ask_codebase_question(db: Session, current_user: User, project_id: int, question_text: str) -> Question:
    project = get_project_by_id(db, current_user, project_id)
    files = list_project_files(db, current_user, project.id)
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project must contain at least one file before questions can be answered.",
        )

    latest_analysis = get_latest_completed_analysis(db, project.id)
    analysis_payload = _analysis_to_payload(latest_analysis) if latest_analysis else {}

    try:
        answer = answer_codebase_question(
            question=question_text,
            files=[_code_file_to_payload(code_file) for code_file in files],
            analysis=analysis_payload,
        )
    except AIInvalidResponseError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="OpenAI returned an invalid answer. Please try again.",
        ) from exc
    except AIServiceError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.message) from exc

    saved_question = Question(
        project_id=project.id,
        user_id=current_user.id,
        analysis_id=latest_analysis.id if latest_analysis else None,
        prompt=question_text,
        answer=answer,
    )
    db.add(saved_question)
    db.commit()
    db.refresh(saved_question)
    return saved_question


def list_project_questions(
    db: Session,
    current_user: User,
    project_id: int,
    page: int,
    page_size: int,
) -> tuple[list[Question], int]:
    project = get_project_by_id(db, current_user, project_id)
    offset = (page - 1) * page_size
    total = db.scalar(
        select(func.count(Question.id)).where(
            Question.project_id == project.id,
            Question.user_id == current_user.id,
        )
    ) or 0
    questions = db.execute(
        select(Question)
        .where(Question.project_id == project.id, Question.user_id == current_user.id)
        .order_by(Question.created_at.desc(), Question.id.desc())
        .offset(offset)
        .limit(page_size)
    ).scalars().all()
    return list(questions), int(total)


def get_latest_completed_analysis(db: Session, project_id: int) -> Analysis | None:
    return db.execute(
        select(Analysis)
        .where(Analysis.project_id == project_id, Analysis.status == "completed")
        .order_by(Analysis.created_at.desc(), Analysis.id.desc())
        .limit(1)
    ).scalar_one_or_none()


def get_total_pages(total: int, page_size: int) -> int:
    return ceil(total / page_size) if total else 0


def question_to_read(question: Question) -> dict:
    return {
        "id": question.id,
        "project_id": question.project_id,
        "user_id": question.user_id,
        "analysis_id": question.analysis_id,
        "question": question.prompt,
        "answer": question.answer,
        "created_at": question.created_at,
    }


def _code_file_to_payload(code_file: CodeFile) -> dict:
    return {
        "path": code_file.path,
        "language": code_file.language,
        "content": code_file.content,
    }


def _analysis_to_payload(analysis: Analysis) -> dict:
    return AnalysisRead.model_validate(analysis).model_dump(mode="json")

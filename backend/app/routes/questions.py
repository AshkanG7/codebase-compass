from fastapi import APIRouter, status


router = APIRouter(prefix="/questions", tags=["questions"])


@router.post("", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def ask_question() -> dict[str, str]:
    return {"detail": "Question answering is not implemented in Phase 1."}


@router.get("/{question_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def get_question(question_id: int) -> dict[str, str | int]:
    return {"question_id": question_id, "detail": "Question lookup is not implemented in Phase 1."}

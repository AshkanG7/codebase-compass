def ask_question_placeholder() -> dict[str, str]:
    return {"detail": "Question service is not implemented in Phase 1."}


def get_question_placeholder(question_id: int) -> dict[str, str | int]:
    return {"question_id": question_id, "detail": "Question retrieval is not implemented in Phase 1."}

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class QuestionAskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)

    @field_validator("question")
    @classmethod
    def question_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Question is required.")
        return stripped


class QuestionRead(BaseModel):
    id: int
    project_id: int
    user_id: int
    analysis_id: int | None = None
    question: str
    answer: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedQuestions(BaseModel):
    items: list[QuestionRead]
    page: int
    page_size: int
    total: int
    total_pages: int

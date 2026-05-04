from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class QuestionCreate(BaseModel):
    project_id: int
    analysis_id: int | None = None
    prompt: str = Field(min_length=1, max_length=4000)


class QuestionRead(BaseModel):
    id: int
    project_id: int
    user_id: int
    analysis_id: int | None = None
    prompt: str
    answer: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

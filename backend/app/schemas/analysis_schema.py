from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AnalysisBase(BaseModel):
    status: str = "pending"
    summary: str | None = None
    error_message: str | None = None


class AnalysisCreate(BaseModel):
    project_id: int


class AnalysisRead(AnalysisBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

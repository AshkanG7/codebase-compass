from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CodeFileBase(BaseModel):
    path: str = Field(min_length=1, max_length=500)
    extension: str = Field(min_length=1, max_length=32)
    size_bytes: int = Field(ge=0)


class CodeFileCreate(CodeFileBase):
    content: str


class CodeFileRead(CodeFileBase):
    id: int
    project_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CodeFileBase(BaseModel):
    path: str = Field(min_length=1, max_length=500)
    language: str | None = Field(default=None, max_length=80)


class CodeFileCreate(CodeFileBase):
    content: str = Field(min_length=1)

    @field_validator("path")
    @classmethod
    def path_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("File path is required.")
        return stripped

    @field_validator("content")
    @classmethod
    def content_must_not_be_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("File content is required.")
        return value


class CodeFileUploadRequest(BaseModel):
    files: list[CodeFileCreate] = Field(min_length=1, max_length=50)


class CodeFileRead(BaseModel):
    id: int
    project_id: int
    path: str
    language: str | None = None
    extension: str
    size_bytes: int
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CodeFileUploadResponse(BaseModel):
    files: list[CodeFileRead]

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ImportantFile(BaseModel):
    path: str
    reason: str
    what_it_does: str


class RiskyOrConfusingPart(BaseModel):
    issue: str
    why_it_matters: str
    suggestion: str


class FirstFileToRead(BaseModel):
    path: str
    reason: str


class CodebaseAnalysisResult(BaseModel):
    summary: str = ""
    detected_stack: list[str] = Field(default_factory=list)
    architecture: str = ""
    important_files: list[ImportantFile] = Field(default_factory=list)
    how_to_run: str = ""
    data_flow: str = ""
    risky_or_confusing_parts: list[RiskyOrConfusingPart] = Field(default_factory=list)
    first_files_to_read: list[FirstFileToRead] = Field(default_factory=list)
    suggested_next_steps: list[str] = Field(default_factory=list)


class AnalysisBase(BaseModel):
    status: str = "pending"
    summary: str | None = None
    detected_stack: list[str] | None = None
    architecture: str | None = None
    important_files: list[ImportantFile] | None = None
    how_to_run: str | None = None
    data_flow: str | None = None
    risky_or_confusing_parts: list[RiskyOrConfusingPart] | None = None
    first_files_to_read: list[FirstFileToRead] | None = None
    suggested_next_steps: list[str] | None = None
    error_message: str | None = None


class AnalysisCreate(BaseModel):
    project_id: int


class AnalysisRead(AnalysisBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

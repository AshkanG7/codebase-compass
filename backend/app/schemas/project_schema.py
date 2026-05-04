from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.analysis_schema import AnalysisRead
from app.schemas.code_file_schema import CodeFileRead


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    description: str | None = None

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Project name is required.")
        return stripped


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectDetail(ProjectRead):
    files: list[CodeFileRead] = Field(default_factory=list)
    latest_analysis: AnalysisRead | None = None


class PaginatedProjects(BaseModel):
    items: list[ProjectRead]
    page: int
    page_size: int
    total: int
    total_pages: int

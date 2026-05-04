from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"
    __table_args__ = (
        Index("ix_analyses_project_id_created_at", "project_id", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(40), index=True, default="pending", nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_stack: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    architecture: Mapped[str | None] = mapped_column(Text, nullable=True)
    important_files: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    how_to_run: Mapped[str | None] = mapped_column(Text, nullable=True)
    data_flow: Mapped[str | None] = mapped_column(Text, nullable=True)
    risky_or_confusing_parts: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    first_files_to_read: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    suggested_next_steps: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    project: Mapped["Project"] = relationship(back_populates="analyses")
    questions: Mapped[list["Question"]] = relationship(back_populates="analysis")

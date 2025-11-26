from datetime import datetime
from app.models.authors import Author
from app.models.base import Base
from app.models.association_tables import article_author_association
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, DateTime, ForeignKey, Table, func, text, types
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import relationship
from typing import Any, List
from sqlalchemy import Text

from app.models.files import File


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[str] = mapped_column(
        primary_key=True,
    )
    doi: Mapped[str | None] = mapped_column()
    title: Mapped[str] = mapped_column()
    pages_in_volume: Mapped[str | None] = mapped_column(default=None)
    type: Mapped[str] = mapped_column(
        default="research_paper"
    )  # editorial, research_paper, conference_paper
    editorial: Mapped[bool] = mapped_column(default=False)
    abstract: Mapped[str] = mapped_column(Text)
    keywords: Mapped[list[str]] = mapped_column(ARRAY(Text))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    received_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )
    revised_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )
    accepted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
    )

    body: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB, nullable=True, default=list
    )

    pdf_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("files.id"))
    pdf: Mapped["File"] = relationship()

    authors: Mapped[list["Author"]] = relationship(
        secondary=article_author_association,
        back_populates="articles",
        order_by=article_author_association.c.created_at,
    )

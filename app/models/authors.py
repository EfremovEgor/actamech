from datetime import datetime
from app.models.base import Base
from app.models.association_tables import (
    article_author_association,
    author_affiliations_association,
)
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Column, DateTime, ForeignKey, Table, func, text, types
from sqlalchemy.orm import relationship
from typing import List, Optional


class AuthorAffiliationAssociation(Base):
    __table__ = author_affiliations_association

    author: Mapped["Author"] = relationship(back_populates="affiliation_associations")
    affiliation: Mapped["Affiliation"] = relationship(
        back_populates="author_associations"
    )
    clarification: Mapped[Optional["AffiliationClarification"]] = relationship()


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )

    first_name: Mapped[str] = mapped_column()
    last_name: Mapped[str] = mapped_column()
    middle_name: Mapped[str | None] = mapped_column()
    email: Mapped[str | None] = mapped_column()
    scopus_id: Mapped[str | None] = mapped_column()
    orcid_id: Mapped[str | None] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    articles: Mapped[list["Article"]] = relationship(
        secondary=article_author_association, back_populates="authors"
    )

    affiliation_associations: Mapped[list["AuthorAffiliationAssociation"]] = (
        relationship(
            back_populates="author",
            cascade="all, delete-orphan",
        )
    )

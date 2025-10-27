from app.models.base import Base
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import ForeignKey, text, types
from sqlalchemy.orm import relationship
from typing import List


class Affiliation(Base):
    __tablename__ = "affiliations"

    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid, primary_key=True, server_default=text("gen_random_uuid()")
    )

    name: Mapped[str] = mapped_column(unique=True)
    address: Mapped[str] = mapped_column()
    country: Mapped[str] = mapped_column()
    city: Mapped[str] = mapped_column()
    postal_code: Mapped[str | None] = mapped_column()

    aliases: Mapped[List["AffiliationAlias"]] = relationship(
        back_populates="affiliation"
    )
    clarifications: Mapped[List["AffiliationClarification"]] = relationship(
        back_populates="affiliation"
    )
    author_associations: Mapped[List["AuthorAffiliationAssociation"]] = relationship(
        back_populates="affiliation"
    )


class AffiliationAlias(Base):
    __tablename__ = "affiliations_aliases"

    id: Mapped[int] = mapped_column(primary_key=True)

    affiliation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("affiliations.id"))
    affiliation: Mapped["Affiliation"] = relationship(back_populates="aliases")

    alias: Mapped[str] = mapped_column()


class AffiliationClarification(Base):
    __tablename__ = "affiliation_clarification"

    id: Mapped[int] = mapped_column(primary_key=True)

    affiliation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("affiliations.id"))
    affiliation: Mapped["Affiliation"] = relationship(back_populates="clarifications")

    faculty: Mapped[str | None] = mapped_column()
    department: Mapped[str | None] = mapped_column()

from datetime import datetime
from app.models.authors import Author
from app.models.base import Base
from app.models.association_tables import proceeding_volume_articles_association, proceeding_volume_editors_association
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import  Column, DateTime, ForeignKey, Table, text, types
from sqlalchemy.dialects.postgresql import ARRAY,JSONB
from sqlalchemy.orm import relationship
from typing import Any, List
from sqlalchemy import Text

from app.models.editors import Editor
from app.models.files import File

class Proceeding(Base):
    __tablename__ = 'proceedings'
    
    id: Mapped[str] = mapped_column(
        primary_key=True,
    )
    
    title: Mapped[str] = mapped_column()
    volumes: Mapped[list["ProceedingVolume"]] = relationship(
        back_populates="proceeding",
        cascade="all, delete-orphan"
    )


class ProceedingVolume(Base):
    __tablename__ = 'proceeding_volume'
    
    id: Mapped[str] = mapped_column(
        primary_key=True,
    )
    
    title: Mapped[str] = mapped_column()
    total_pages: Mapped[str] = mapped_column()
    volume_number: Mapped[str] = mapped_column()
    
    place: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    conference_full_name: Mapped[str] = mapped_column()
    held_at: Mapped[str | None] = mapped_column()
    published_at: Mapped[datetime | None] = mapped_column()
    articles: Mapped[list["Article"]] = relationship(
        secondary=proceeding_volume_articles_association,
        order_by=proceeding_volume_articles_association.c.position,
    )
    editors: Mapped[list["Editor"]] = relationship(
        secondary=proceeding_volume_editors_association,
        order_by=proceeding_volume_editors_association.c.position,
    )
    
    
    proceeding_id: Mapped[str | None] = mapped_column(ForeignKey("proceedings.id"), nullable=True)
    proceeding: Mapped["Proceeding"] = relationship(back_populates="volumes")

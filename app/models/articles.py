from datetime import datetime
from app.models.base import Base
from app.models.association_tables import article_author_association
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import  Column, DateTime, ForeignKey, Table, text, types
from sqlalchemy.dialects.postgresql import ARRAY,JSONB
from sqlalchemy.orm import relationship
from typing import Any, List
from sqlalchemy import Text



class Article(Base):
    __tablename__ = 'articles'
    
    id: Mapped[str] = mapped_column(
        primary_key=True,
    )
    title: Mapped[str] = mapped_column()
    abstract: Mapped[str] = mapped_column(Text)
    keywords: Mapped[list[str]] = mapped_column(ARRAY(Text))
    received_at:Mapped[datetime|None] = mapped_column(
        DateTime(timezone=True),
    )
    revised_at:Mapped[datetime|None] = mapped_column(
        DateTime(timezone=True),
    )
    accepted_at:Mapped[datetime|None] = mapped_column(
        DateTime(timezone=True),
    )
    published_at:Mapped[datetime|None] = mapped_column(
        DateTime(timezone=True),
    )
    
    body:Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
        default=dict
    )
    
    authors: Mapped[list["Author"]] = relationship(
        secondary=article_author_association,
        back_populates="articles"
    )
    

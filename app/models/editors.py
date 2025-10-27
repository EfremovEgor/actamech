from datetime import datetime, timezone
from app.models.base import Base
from app.models.association_tables import article_author_association
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import  BIGINT, Column, DateTime, ForeignKey, Table, text, types
from sqlalchemy.dialects.postgresql import ARRAY,JSONB
from sqlalchemy.orm import relationship
from typing import Any, List
from sqlalchemy import Text



class Editor(Base):
    __tablename__ = 'editors'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    prefix: Mapped[str] = mapped_column()
    first_name: Mapped[str] = mapped_column()
    last_name: Mapped[str] = mapped_column()
    title: Mapped[str] = mapped_column() #
    institution: Mapped[str] = mapped_column()
    country: Mapped[str] = mapped_column()
    

    

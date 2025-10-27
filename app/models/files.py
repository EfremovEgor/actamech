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



class File(Base):
    __tablename__ = 'files'
    
    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()") 
    )
    
    original_name: Mapped[str] = mapped_column()
    stored_name: Mapped[str] = mapped_column()
    extension: Mapped[str] = mapped_column()  
    path: Mapped[str] = mapped_column()  
    created_at:Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
    )
                                    
    size_bytes:Mapped[int] = mapped_column(BIGINT)
    hash: Mapped[str] = mapped_column()
 
    

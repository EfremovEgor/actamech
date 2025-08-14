from app.models.base import Base
from app.models.association_tables import article_author_association
import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import  Column, ForeignKey, Table, text, types
from sqlalchemy.orm import relationship
from typing import List




class Author(Base):
    __tablename__ = 'authors'
    
    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()") 
    )
    
    first_name: Mapped[str] = mapped_column()
    last_name: Mapped[str] = mapped_column()
    middle_name: Mapped[str|None] = mapped_column()
    email: Mapped[str] = mapped_column()
    scopus_id: Mapped[str] = mapped_column()
    orcid_id: Mapped[str] = mapped_column()
    
    affiliation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("affiliations.id"))
    affiliation: Mapped["Affiliation"] = relationship()

    affiliation_clarification_id: Mapped[int] = mapped_column(ForeignKey("affiliation_clarification.id"))
    affiliation_clarification: Mapped["AffiliationClarification"] = relationship()
    
    articles: Mapped[list["Article"]] = relationship(
        secondary=article_author_association,
        back_populates="authors"
    )
    
    

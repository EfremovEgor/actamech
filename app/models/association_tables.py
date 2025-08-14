
from sqlalchemy import Column, ForeignKey, Table

from app.models.base import Base


article_author_association = Table(
    "article_authors",
    Base.metadata,
    Column("article_id", ForeignKey("articles.id"), primary_key=True),
    Column("author_id", ForeignKey("authors.id"), primary_key=True),
)

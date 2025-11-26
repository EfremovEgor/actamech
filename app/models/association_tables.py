from sqlalchemy import (
    VARCHAR,
    UUID,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Table,
    UniqueConstraint,
    func,
)

from app.models.base import Base


article_author_association = Table(
    "article_authors",
    Base.metadata,
    Column(
        "article_id",
        VARCHAR,
        ForeignKey("articles.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Column(
        "author_id",
        UUID(as_uuid=True),
        ForeignKey("authors.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column("created_at", DateTime(timezone=True), default=func.now(), nullable=False),
    UniqueConstraint("article_id", "author_id", name="uq_article_author"),
)

author_affiliations_association = Table(
    "authors_affiliations",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("author_id", ForeignKey("authors.id", ondelete="CASCADE")),
    Column("author_affiliation_id", ForeignKey("affiliations.id")),
    Column(
        "affiliation_clarification_id",
        ForeignKey("affiliation_clarification.id"),
        nullable=True,
        default=None,
    ),
)


proceeding_volume_articles_association = Table(
    "proceeding_volume_articles",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column(
        "proceeding_volume_id", ForeignKey("proceeding_volume.id", ondelete="CASCADE")
    ),
    Column(
        "article_id", ForeignKey("articles.id", onupdate="CASCADE", ondelete="CASCADE")
    ),
    Column("position", Integer, nullable=True, default=None),
)


proceeding_volume_editors_association = Table(
    "proceeding_volume_editors",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("proceeding_volume_id", ForeignKey("proceeding_volume.id")),
    Column("editor_id", ForeignKey("editors.id")),
    Column("position", Integer, nullable=True, default=None),
)

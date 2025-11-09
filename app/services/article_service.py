import uuid
from fastapi import Depends, UploadFile
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import delete, desc, func, insert, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_app_settings
from app.database.database import get_async_session, paginate
from sqlalchemy.orm import selectinload

from app.models.affiliations import Affiliation
from app.models.articles import Article
from app.models.association_tables import article_author_association
from app.models.authors import Author, AuthorAffiliationAssociation
from app.models.files import File
from app.models.proceedings import ProceedingVolume
from app.schemas.article import (
    ArticleBase,
    ArticleInCreate,
    ArticleUpdate,
    ArticleVolume,
    MultipleArticlesResponse,
    SingleArticleResponse,
)
from app.models.association_tables import proceeding_volume_articles_association
from app.schemas.author import MultipleAuthorsResponse
from app.services.base import BaseService
from app.services.file_service import FileService


class ArticleService(BaseService):
    async def get_articles(
        self,
        search_string: str | None,
        page: int = 0,
        per_page: int = get_app_settings().pagination_items_per_page,
    ):

        stmt = select(Article.id, Article.title, Article.doi).order_by(
            desc(Article.created_at)
        )
        if search_string:
            stmt = stmt.where(
                or_(
                    Article.id.ilike(f"%{search_string}%"),
                    Article.title.ilike(f"%{search_string}%"),
                    Article.doi.ilike(f"%{search_string}%"),
                )
            )
        data = await paginate(self.db, stmt, page, per_page)
        return {
            "items": [
                MultipleArticlesResponse.model_validate(article)
                for article in data["items"]
            ],
            "meta": data["meta"],
        }

    async def get_article_pdf(
        self, id: str, file_service: FileService
    ) -> tuple[File, str]:
        stmt = select(Article.pdf_id).where(Article.id == id)

        result = await self.db.execute(stmt)
        pdf_id = result.scalar_one_or_none()

        if pdf_id is None:
            return None
        file = await file_service.get_file(pdf_id)
        return (file, file_service.get_abs_file_path(file.stored_name, file.extension))

    async def update_article(self, data: ArticleUpdate, id: str):
        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise ValueError("No fields provided for update")

        article = await self.db.get(Article, id)
        if not article:
            raise ValueError({"field": "id", "msg": f"Article {id} not found"})

        if "id" in update_data:
            new_id = update_data["id"]

            if new_id == article.id:
                update_data.pop("id")
            else:
                exists = await self.db.get(Article, new_id)
                if exists:
                    raise ValueError({"field": "id", "msg": "Id must be unique"})

        if "volume_id" in update_data:
            new_volume_id = update_data.pop("volume_id")
            # TODO Добавить еще regular volumes
            await self.db.execute(
                delete(proceeding_volume_articles_association).where(
                    proceeding_volume_articles_association.c.article_id == id
                )
            )

            if new_volume_id:
                await self.db.execute(
                    insert(proceeding_volume_articles_association).values(
                        article_id=id,
                        proceeding_volume_id=new_volume_id,
                    )
                )

        for key in list(update_data.keys()):
            if key != "id" and getattr(article, key) == update_data[key]:
                update_data.pop(key)

        if update_data:

            stmt = update(Article).where(Article.id == id).values(**update_data)

            try:
                result = await self.db.execute(stmt)
                if result.rowcount == 0:
                    raise ValueError({"field": "id", "msg": f"Article {id} not found"})
                await self.db.commit()

            except IntegrityError as e:
                await self.db.rollback()
                if "doi" in str(e.orig):
                    raise ValueError({"field": "doi", "msg": "DOI must be unique"})
                print(e)

                if "id" in str(e.orig):
                    raise ValueError({"field": "id", "msg": "Id must be unique"})

                raise ValueError(
                    {"field": "general", "msg": "Database integrity error"}
                )

            except SQLAlchemyError as e:
                await self.db.rollback()
                raise ValueError({"field": "general", "msg": str(e)})
        await self.db.commit()

    async def delete_article(self, id: str):
        article = await self.db.get(Article, id)
        if not article:
            raise ValueError({"field": "id", "msg": f"Article {id} not found"})
        await self.db.delete(article)
        await self.db.commit()

    async def get_article_by_id(self, id: str):
        stmt = (
            select(Article)
            .where(Article.id == id)
            .options(
                selectinload(Article.authors)
                .selectinload(Author.affiliation_associations)
                .options(
                    selectinload(AuthorAffiliationAssociation.affiliation).selectinload(
                        Affiliation.aliases
                    ),
                ),
                selectinload(Article.authors)
                .selectinload(Author.affiliation_associations)
                .options(
                    selectinload(AuthorAffiliationAssociation.affiliation),
                ),
                selectinload(Article.authors)
                .selectinload(Author.affiliation_associations)
                .options(
                    selectinload(AuthorAffiliationAssociation.clarification),
                ),
            )
        )

        result = await self.db.execute(stmt)
        article = result.scalar_one_or_none()

        if article is None:
            return None

        if article.type == "conference_paper":
            stmt = (
                select(ProceedingVolume)
                .join(proceeding_volume_articles_association)
                .where(
                    proceeding_volume_articles_association.c.article_id == article.id
                )
            )
        result = await self.db.execute(stmt)
        article_data = SingleArticleResponse.model_validate(article)

        volume = result.scalar_one_or_none()
        if volume is not None:
            volume_data = ArticleVolume.model_validate(volume)
            article_data.volume = volume_data
        return article_data

    async def upload_article_pdf(
        self, id: uuid.UUID, file: UploadFile, file_service: FileService
    ):
        if not file_service.validate_extension(file, ["pdf"]):
            raise ValueError(f"Invalid file extension")

        stmt = select(Article.id, Article.pdf_id).where(Article.id == id)
        result = await self.db.execute(stmt)
        article = result.scalar_one_or_none()
        if article is None:
            raise ValueError(f"Article {id} doesn't exist")

        # await file_service.delete_file_by_id(article.pdf_id)
        pdf = await file_service.save_uploaded_file(file)
        stmt = update(Article).where(Article.id == id).values(pdf_id=pdf.id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def create_article(
        self,
        data: ArticleInCreate,
        file_service: FileService,
    ) -> Article:

        article = Article(**data.model_dump(exclude=["authors"]))
        self.db.add(article)
        try:
            await self.db.commit()
            await self.db.refresh(article)
        except IntegrityError as ex:
            await self.db.rollback()
            raise ValueError(f"Article with id '{article.id}' already exists")

        await self.db.flush()
        if data.authors:
            stmt = insert(article_author_association).values(
                [
                    {"article_id": article.id, "author_id": author_id}
                    for author_id in data.authors
                ]
            )

            await self.db.execute(stmt)
            await self.db.commit()

        article_data = ArticleBase.model_validate(article)
        return article_data

    async def add_authors(self, id: str, authors: list[uuid.UUID]):
        article = await self.db.get(Article, id)
        if not article:
            raise ValueError({"field": "id", "msg": f"Article {id} not found"})
        result = await self.db.execute(
            select(article_author_association.c.author_id).where(
                article_author_association.c.article_id == article.id
            )
        )
        existing = set(result.scalars().all())

        new_authors = [a for a in authors if a not in existing]
        if new_authors:

            stmt = insert(article_author_association).values(
                [
                    {"article_id": article.id, "author_id": author_id}
                    for author_id in authors
                ]
            )
            await self.db.execute(stmt)
            await self.db.commit()

    async def remove_authors(self, article_id: str, author_ids: list[uuid.UUID]):
        article = await self.db.get(Article, article_id)
        if not article:
            raise ValueError(f"Article {article_id} not found")

        if not author_ids:
            return []

        stmt = delete(article_author_association).where(
            article_author_association.c.article_id == article_id,
            article_author_association.c.author_id.in_(author_ids),
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def get_available_authors_to_add(
        self,
        article_id: str,
        search_string: str | None,
        page: int = 0,
        per_page: int = get_app_settings().pagination_items_per_page,
    ):
        article = await self.db.get(Article, article_id)
        if not article:
            raise ValueError(f"Article {article_id} not found")

        result = await self.db.execute(
            select(article_author_association.c.author_id).where(
                article_author_association.c.article_id == article_id
            )
        )
        existing_ids = set(result.scalars().all())

        stmt = select(Author.id, Author.first_name, Author.last_name).where(
            ~Author.id.in_(existing_ids)
        )

        if search_string:
            stmt = stmt.where(
                or_(
                    Author.email.ilike(f"%{search_string}%"),
                    func.concat(Author.first_name, " ", Author.last_name).ilike(
                        f"%{search_string}%"
                    ),
                )
            )

        data = await paginate(self.db, stmt, page, per_page)

        return {
            "items": [
                MultipleAuthorsResponse.model_validate(author)
                for author in data["items"]
            ],
            "meta": data["meta"],
        }


def get_article_service(db: AsyncSession = Depends(get_async_session)):
    return ArticleService(db)

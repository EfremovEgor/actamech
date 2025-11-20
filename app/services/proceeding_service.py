from operator import or_
from fastapi import Depends

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_app_settings
from app.database.database import get_async_session, paginate
from app.models.affiliations import Affiliation
from app.models.articles import Article
from app.models.authors import Author
from app.models.proceedings import Proceeding, ProceedingVolume
from app.schemas.proceeding import (
    ArticleInVolume,
    ProceedingResponse,
    ProceedingVolumeListItemResponse,
    ProceedingVolumeResponse,
    AuthorInArticle as AuthorInProceedingVolumeArticle,
)
from app.services.base import BaseService


class ProceedingService(BaseService):
    async def get_proceeding_by_id(self, id: str):
        stmt = (
            select(Proceeding)
            .where(Proceeding.id == id)
            .options(
                selectinload(Proceeding.volumes).load_only(
                    ProceedingVolume.id,
                    ProceedingVolume.title,
                    ProceedingVolume.volume_number,
                    ProceedingVolume.conference_full_name,
                )
            )
        )
        result = await self.db.execute(stmt)
        proceeding = result.scalar_one_or_none()
        if proceeding is None:
            return None

        return ProceedingResponse.model_validate(proceeding)


class ProceedingVolumeService(BaseService):
    async def get_volume_by_id(self, id: str):
        stmt = (
            select(ProceedingVolume)
            .where(ProceedingVolume.id == id)
            .options(
                selectinload(ProceedingVolume.articles)
                .load_only(
                    Article.id,
                    Article.abstract,
                    Article.doi,
                    Article.title,
                    Article.type,
                    Article.editorial,
                    Article.published_at,
                )
                .selectinload(Article.authors)
                .load_only(
                    Author.first_name,
                    Author.last_name,
                ),
                selectinload(ProceedingVolume.proceeding),
                selectinload(ProceedingVolume.editors),
            )
        )
        result = await self.db.execute(stmt)
        volume = result.scalar_one_or_none()
        if volume is None:
            return None
        articles = [
            ArticleInVolume(
                id=article.id,
                abstract=article.abstract,
                doi=article.doi,
                title=article.title,
                type=article.type,
                editorial=article.editorial,
                published_at=article.published_at,
                authors=[
                    AuthorInProceedingVolumeArticle(
                        first_name=author.first_name, last_name=author.last_name
                    )
                    for author in article.authors
                ],
            )
            for article in volume.articles
        ]

        volume_response = ProceedingVolumeResponse(
            id=volume.id,
            title=volume.title,
            volume_number=volume.volume_number,
            total_pages=volume.total_pages,
            place=volume.place,
            description=volume.description,
            conference_full_name=volume.conference_full_name,
            held_at=volume.held_at,
            published_at=volume.published_at,
            articles=articles,
            proceeding=volume.proceeding,
            editors=volume.editors,
        )

        return volume_response

    async def get_all_volumes(
        self,
        search_string: str | None,
        page: int = 0,
        per_page: int = get_app_settings().pagination_items_per_page,
    ):
        stmt = select(
            ProceedingVolume.id, ProceedingVolume.title, ProceedingVolume.volume_number
        ).order_by(ProceedingVolume.volume_number)

        if search_string:
            stmt = stmt.where(
                or_(
                    ProceedingVolume.volume_number.ilike(f"%{search_string}%"),
                    ProceedingVolume.title.ilike(f"%{search_string}%"),
                )
            )

        data = await paginate(self.db, stmt, page, per_page)
        return {
            "items": [
                ProceedingVolumeListItemResponse.model_validate(item)
                for item in data["items"]
            ],
            "meta": data["meta"],
        }


def get_proceeding_volume_service(db: AsyncSession = Depends(get_async_session)):
    return ProceedingVolumeService(db)


def get_proceeding_service(db: AsyncSession = Depends(get_async_session)):
    return ProceedingService(db)

import uuid
from fastapi import Depends
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.core.config import get_app_settings
from app.database.database import get_async_session, paginate
from app.models.affiliations import Affiliation
from app.schemas.affiliation import (
    AffiliationBase,
    AffiliationInCreate,
    AffiliationListItem,
    AffiliationResponse,
)
from app.services.base import BaseService


class AffiliationService(BaseService):
    async def create_affiliation(self, data: AffiliationInCreate) -> Affiliation:
        affiliation = Affiliation(**data.model_dump())
        self.db.add(affiliation)

        try:
            await self.db.commit()
            await self.db.refresh(affiliation)
        except IntegrityError:
            await self.db.rollback()
            raise ValueError(f"User with name '{affiliation.name}' already exists")
        return AffiliationResponse.model_validate(affiliation)

    async def get_affiliations(
        self,
        search_string: str | None,
        page: int = 0,
        per_page: int = get_app_settings().pagination_items_per_page,
    ) -> list[AffiliationBase]:
        stmt = select(Affiliation.id, Affiliation.name, Affiliation.country)
        if search_string:
            stmt = stmt.where(
                or_(
                    Affiliation.name.ilike(f"%{search_string}%"),
                    Affiliation.address.ilike(f"%{search_string}%"),
                    Affiliation.country.ilike(f"%{search_string}%"),
                )
            )

        data = await paginate(self.db, stmt, page, per_page)
        return {
            "items": [
                AffiliationListItem.model_validate(author) for author in data["items"]
            ],
            "meta": data["meta"],
        }

    async def get_affiliation_by_id(self, id: uuid.UUID):
        stmt = (
            select(Affiliation)
            .where(Affiliation.id == id)
            .options(
                selectinload(Affiliation.aliases),
                selectinload(Affiliation.clarifications),
            )
        )

        result = await self.db.execute(stmt)
        affiliation = result.scalar_one_or_none()

        if affiliation is None:
            return None

        return AffiliationResponse.model_validate(affiliation)


def get_affiliation_service(db: AsyncSession = Depends(get_async_session)):
    return AffiliationService(db)

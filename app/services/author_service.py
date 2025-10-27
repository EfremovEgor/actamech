import uuid
from fastapi import Depends, HTTPException

from sqlalchemy import delete, desc, func, or_, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_app_settings
from app.database.database import get_async_session, paginate
from sqlalchemy.orm import selectinload
from starlette import status

from app.models.affiliations import Affiliation
from app.models.association_tables import author_affiliations_association
from app.models.authors import Author, AuthorAffiliationAssociation
from app.schemas.affiliation import AffiliationClarificationResponse
from app.schemas.author import (
    AuthorAffiliationClarificationResponse,
    AuthorAffiliationItem,
    AuthorCreate,
    AuthorResponse,
    AuthorUpdate,
    MultipleAuthorsResponse,
)
from app.services.base import BaseService


class AuthorService(BaseService):
    async def get_authors(
        self,
        search_string: str | None,
        page: int = 0,
        per_page: int = get_app_settings().pagination_items_per_page,
    ):
        stmt = select(Author.id, Author.first_name, Author.last_name).order_by(
            desc(Author.created_at)
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

    async def get_author_by_id(self, id: uuid.UUID):
        stmt = (
            select(Author)
            .where(Author.id == id)
            .options(
                selectinload(Author.affiliation_associations).options(
                    selectinload(AuthorAffiliationAssociation.affiliation),
                    selectinload(AuthorAffiliationAssociation.clarification),
                ),
            )
        )
        result = await self.db.execute(stmt)
        author = result.scalar_one_or_none()

        if author is None:
            return None

        affiliations = []
        for association in author.affiliation_associations:
            affiliation = association.affiliation
            clarification = association.clarification

            affiliation_item = AuthorAffiliationClarificationResponse(
                id=affiliation.id,
                name=affiliation.name,
                address=affiliation.address,
                country=affiliation.country,
                city=affiliation.city,
                postal_code=affiliation.postal_code,
                clarification=(
                    AffiliationClarificationResponse.model_validate(clarification)
                    if clarification
                    else None
                ),
            )
            affiliations.append(affiliation_item)

        author_response = AuthorResponse(
            id=author.id,
            first_name=author.first_name,
            last_name=author.last_name,
            middle_name=author.middle_name,
            email=author.email,
            scopus_id=author.scopus_id,
            orcid_id=author.orcid_id,
            created_at=author.created_at,
            affiliations=affiliations,
        )

        return author_response

    async def delete_author(self): ...

    async def create_author(self, data: AuthorCreate):
        author = Author(**data.model_dump())
        self.db.add(author)
        try:
            await self.db.commit()
            await self.db.refresh(author)
        except IntegrityError as ex:
            await self.db.rollback()

        return AuthorResponse.model_validate(author)

    async def update_author(self, id: uuid.UUID, data: AuthorUpdate):
        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise ValueError("No fields provided for update")

        author = await self.db.get(Author, id)
        if not author:
            raise ValueError({"field": "id", "msg": f"Author {id} not found"})

        for key in list(update_data.keys()):
            if key != "id" and getattr(author, key) == update_data[key]:
                update_data.pop(key)

        if update_data:
            stmt = update(Author).where(Author.id == id).values(**update_data)

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

    async def delete_author(self, id: str):
        author = await self.db.get(Author, id)
        if not author:
            raise ValueError({"field": "id", "msg": f"Author {id} not found"})
        await self.db.delete(author)
        await self.db.commit()

    async def add_affiliations_to_author(
        self, author_id: uuid.UUID, affiliations: list[AuthorAffiliationItem]
    ):
        author = await self.db.get(Author, author_id)
        if not author:
            raise ValueError(f"Author with id {author_id} not found")

        affiliation_ids = [affil.author_affiliation_id for affil in affiliations]
        clarification_ids = [
            affil.affiliation_clarification_id
            for affil in affiliations
            if affil.affiliation_clarification_id
        ]

        stmt = select(Affiliation).where(Affiliation.id.in_(affiliation_ids))
        result = await self.db.execute(stmt)
        existing_affiliations = result.scalars().all()

        if len(existing_affiliations) != len(affiliation_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more affiliations not found",
            )

        for affiliation_item in affiliations:
            association = author_affiliations_association.insert().values(
                author_id=author_id,
                author_affiliation_id=affiliation_item.author_affiliation_id,
                affiliation_clarification_id=affiliation_item.affiliation_clarification_id,
            )
            await self.db.execute(association)

        await self.db.commit()

        return

    async def remove_affiliations_from_author(
        self, author_id: uuid.UUID, affiliations: list[AuthorAffiliationItem]
    ):
        author = await self.db.get(Author, author_id)
        if not author:
            raise ValueError(f"Author with id {author_id} not found")

        for af in affiliations:
            stmt = select(AuthorAffiliationAssociation).where(
                AuthorAffiliationAssociation.author_id == author_id,
                AuthorAffiliationAssociation.author_affiliation_id
                == af.author_affiliation_id,
                AuthorAffiliationAssociation.affiliation_clarification_id
                == af.affiliation_clarification_id,
            )

            result = await self.db.execute(stmt)
            association = result.scalar_one_or_none()

            if association is None:
                continue

            await self.db.delete(association)
            await self.db.commit()
        return True


def get_author_service(db: AsyncSession = Depends(get_async_session)):
    return AuthorService(db)

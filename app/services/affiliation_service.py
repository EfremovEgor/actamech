from fastapi import Depends

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.database.database import get_async_session
from app.models.affiliations import Affiliation
from app.schemas.affiliation import AffiliationBase, AffiliationInCreate
from app.services.base import BaseService


class AffiliationService(BaseService):
    async def create_affiliation(self, data: AffiliationInCreate)->Affiliation:
        affiliation = Affiliation(**data.model_dump())
        self.db.add(affiliation)
        
        try:
            await self.db.commit()
            await self.db.refresh(affiliation)
        except IntegrityError:
            await self.db.rollback()
            raise ValueError(f"User with name '{affiliation.name}' already exists")
        return affiliation

    async def get_all_affiliations(self)->list[AffiliationBase]:
        result = await self.db.execute(select(Affiliation))
        affiliations= result.scalars().all()
        
        return [AffiliationBase.model_validate(affiliation) for affiliation in affiliations]
    
    
    
    
def get_affiliation_service(db: AsyncSession = Depends(get_async_session)):
    return AffiliationService(db)
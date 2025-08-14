from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_async_session

from app.services.base import BaseService


class AuthorService(BaseService):
    ...
    
    
    
    
def get_author_service(db: AsyncSession = Depends(get_async_session)):
    return AuthorService(db)
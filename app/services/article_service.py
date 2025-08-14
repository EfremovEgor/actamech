from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_async_session

from app.models.articles import Article
from app.models.authors import Author
from app.schemas.article import ArticleBase
from app.services.base import BaseService


class ArticleService(BaseService):
    async def get_article_by_id(
        self, id:str
    ):
        stmt = select(Article).where(Article.id == id)
        result = await self.db.execute(stmt)
        article = result.scalar_one_or_none()  
        if article is None:
            return None
        return ArticleBase.model_validate(article)
    
    
    
def get_article_service(db: AsyncSession = Depends(get_async_session)):
    return ArticleService(db)
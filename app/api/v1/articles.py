from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from app.database.database import get_async_session
from app.schemas.article import ArticleBase
from app.schemas.messages import ApiErrorResponse, ApiResponse
from app.services.article_service import ArticleService, get_article_service



router = APIRouter(prefix="")

@router.get("/{id}")
async def get_article_by_id(id: str, article_service: ArticleService = Depends(get_article_service)):
    article = await article_service.get_article_by_id(id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ApiErrorResponse(message=f"article with id {id} does not exist")) 

    return ApiResponse(data=article)


# @router.post("")
# async def add_affiliation(data:AffiliationInCreate,affiliation_service: AffiliationService = Depends(get_affiliation_service)):
#     try:
#         return await affiliation_service.create_affiliation(data)
#     except ValueError:
#         return ApiErrorResponse(message=f"{data.name} already exists")
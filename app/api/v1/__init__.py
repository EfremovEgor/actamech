from fastapi import APIRouter

from app.api.v1 import affiliations, articles

api_router = APIRouter()
api_router.include_router(affiliations.router, prefix="/affilitions", tags=["affiliations"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
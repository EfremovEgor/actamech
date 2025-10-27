from fastapi import APIRouter

from app.api.v1 import affiliations, articles, proceedings, authors

api_router = APIRouter()
api_router.include_router(affiliations.router, prefix="/affiliations", tags=["affiliations"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(proceedings.router, prefix="/proceedings", tags=["proceedings"])
api_router.include_router(authors.router, prefix="/authors", tags=["authors"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
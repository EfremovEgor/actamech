import json
import logging
from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Body, Depends, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from starlette import status

from app.database.database import get_async_session
from app.models.files import File
from app.schemas.article import (
    ArticleBase,
    ArticleInCreate,
    ArticleUpdate,
    MultipleArticlesResponse,
    SingleArticleResponse,
)
from app.schemas.author import MultipleAuthorsResponse
from app.schemas.messages import (
    ApiErrorResponse,
    ApiPaginatedResponse,
    ApiPaginationParams,
    ApiPaginationSearchParams,
    ApiResponse,
)
from app.services.article_service import ArticleService, get_article_service
from app.services.file_service import FileService, get_file_service


router = APIRouter()


@router.get("/{id}")
async def get_article_by_id(
    id: str, article_service: ArticleService = Depends(get_article_service)
) -> ApiResponse[SingleArticleResponse]:
    article = await article_service.get_article_by_id(id)
    if article is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"article with id {id} does not exist"
            ).model_dump(),
        )

    return ApiResponse(data=article)


@router.post("")
async def create_article(
    data: ArticleInCreate,
    article_service: ArticleService = Depends(get_article_service),
    file_service: FileService = Depends(get_file_service),
):

    try:
        return ApiResponse(
            data=await article_service.create_article(data, file_service)
        )
    except ValueError as ex:
        print(ex)
        return ApiErrorResponse(message=f"Article {data.id} already exists")


@router.get("")
async def get_articles(
    params: Annotated[ApiPaginationSearchParams, Query()],
    article_service: ArticleService = Depends(get_article_service),
) -> ApiPaginatedResponse[list[MultipleArticlesResponse]]:
    data = await article_service.get_articles(
        params.search_string, params.page, params.per_page
    )

    return ApiPaginatedResponse(data=data)


@router.put("/{id}")
async def update_article(
    id: str,
    data: ArticleUpdate,
    article_service: ArticleService = Depends(get_article_service),
) -> ApiResponse | ApiErrorResponse:
    try:
        data = await article_service.update_article(data, id)
    except ValueError as ex:
        error_dict = ex.args[0] if ex.args else {"field": "general", "msg": str(ex)}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ApiErrorResponse(data=error_dict).model_dump(),
        )

    return ApiResponse()


@router.delete("/{id}")
async def delete_article(
    id: str, article_service: ArticleService = Depends(get_article_service)
) -> ApiResponse | ApiErrorResponse:
    try:
        data = await article_service.delete_article(id)
    except ValueError as ex:
        error_dict = ex.args[0] if ex.args else {"field": "general", "msg": str(ex)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(data=error_dict).model_dump(),
        )

    return ApiResponse()


@router.put("/{id}/pdf")
async def upload_article_pdf(
    id: str,
    file: UploadFile,
    article_service: ArticleService = Depends(get_article_service),
    file_service: FileService = Depends(get_file_service),
) -> ApiResponse | ApiErrorResponse:
    try:
        await article_service.upload_article_pdf(id, file, file_service)
    except ValueError as ex:
        error_dict = ex.args[0] if ex.args else {"field": "general", "msg": str(ex)}
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ApiErrorResponse(data=error_dict).model_dump(),
        )

    return ApiResponse()


@router.get("/{id}/pdf")
async def get_article_pdf(
    id: str,
    download: bool = Query(False),
    article_service: ArticleService = Depends(get_article_service),
    file_service: FileService = Depends(get_file_service),
) -> ApiPaginatedResponse[list[MultipleArticlesResponse]]:
    content: tuple[File, str] = await article_service.get_article_pdf(id, file_service)
    if content is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse().model_dump(),
        )
    headers = {
        "Content-Disposition": (
            f'attachment; filename="{content[0].original_name}.{content[0].extension}"'
            if download
            else "inline"
        )
    }

    logging.info(f"[Article PDF] id={id}, download={download}, headers={headers}")
    return FileResponse(
        path=content[1],
        filename=f"{content[0].original_name}.{content[0].extension}",
        media_type="application/pdf",
        headers=headers,
    )


@router.post("/{id}/authors")
async def add_authors_to_article(
    id: str,
    authors: list[UUID],
    article_service: ArticleService = Depends(get_article_service),
):
    try:
        return await article_service.add_authors(id, authors)
    except ValueError as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"article with id {id} does not exist"
            ).model_dump(),
        )


@router.delete("/{id}/authors")
async def remove_authors_from_article(
    id: str,
    authors: list[UUID],
    article_service: ArticleService = Depends(get_article_service),
):
    try:
        return await article_service.remove_authors(id, authors)
    except ValueError as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"article with id {id} does not exist"
            ).model_dump(),
        )


@router.get("/{id}/authors")
async def get_available_authors_to_add(
    id: str,
    params: Annotated[ApiPaginationSearchParams, Query()],
    article_service: ArticleService = Depends(get_article_service),
) -> ApiPaginatedResponse[list[MultipleAuthorsResponse]]:
    data = await article_service.get_available_authors_to_add(
        id, params.search_string, params.page, params.per_page
    )
    return ApiPaginatedResponse(data=data)

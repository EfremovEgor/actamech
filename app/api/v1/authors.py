from typing import Annotated
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from starlette import status

from app.schemas.author import (
    AuthorAffiliationItem,
    AuthorCreate,
    AuthorResponse,
    AuthorUpdate,
    MultipleAuthorsResponse,
)
from app.schemas.messages import (
    ApiErrorResponse,
    ApiPaginatedResponse,
    ApiPaginationSearchParams,
    ApiResponse,
)
from app.services.author_service import AuthorService, get_author_service


router = APIRouter()


@router.get("")
async def get_authors(
    params: Annotated[ApiPaginationSearchParams, Query()],
    author_service: AuthorService = Depends(get_author_service),
) -> ApiPaginatedResponse[list[MultipleAuthorsResponse]]:
    data = await author_service.get_authors(
        params.search_string, params.page, params.per_page
    )

    return ApiPaginatedResponse(data=data)


@router.get("/{id}")
async def get_author(
    id: uuid.UUID, author_service: AuthorService = Depends(get_author_service)
) -> ApiResponse[AuthorResponse]:
    data = await author_service.get_author_by_id(id)

    return ApiResponse(data=data)


@router.put("/{id}")
async def update_author(
    id: str,
    data: AuthorUpdate,
    author_service: AuthorService = Depends(get_author_service),
) -> ApiResponse | ApiErrorResponse:
    try:
        data = await author_service.update_author(id, data)
    except ValueError as ex:
        error_dict = ex.args[0] if ex.args else {"field": "general", "msg": str(ex)}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ApiErrorResponse(data=error_dict).model_dump(),
        )

    return ApiResponse()


@router.post("")
async def create_author(
    data: AuthorCreate, author_service: AuthorService = Depends(get_author_service)
) -> ApiResponse[AuthorResponse]:

    try:
        return ApiResponse(data=await author_service.create_author(data))
    except ValueError as ex:
        return ApiErrorResponse(message=f"Author {data.id} already exists")


@router.delete("/{id}")
async def delete_author(
    id: str, author_service: AuthorService = Depends(get_author_service)
) -> ApiResponse | ApiErrorResponse:
    try:
        data = await author_service.delete_author(id)
    except ValueError as ex:
        error_dict = ex.args[0] if ex.args else {"field": "general", "msg": str(ex)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(data=error_dict).model_dump(),
        )

    return ApiResponse()


@router.post("/{id}/affiliations")
async def add_affiliations_to_author(
    id: uuid.UUID,
    affiliations: list[AuthorAffiliationItem],
    author_service: AuthorService = Depends(get_author_service),
):
    try:
        return await author_service.add_affiliations_to_author(id, affiliations)
    except ValueError as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"Author with id {id} does not exist"
            ).model_dump(),
        )


@router.delete("/{id}/affiliations")
async def remove_affiliations_from_author(
    id: uuid.UUID,
    affiliations: list[AuthorAffiliationItem],
    author_service: AuthorService = Depends(get_author_service),
):
    try:
        return await author_service.remove_affiliations_from_author(id, affiliations)
    except ValueError as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"Author with id {id} does not exist"
            ).model_dump(),
        )

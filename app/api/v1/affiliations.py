from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from starlette import status
from uuid import UUID

from app.schemas.affiliation import (
    AffiliationInCreate,
    AffiliationListItem,
    AffiliationResponse,
)
from app.schemas.messages import (
    ApiErrorResponse,
    ApiPaginatedResponse,
    ApiPaginationSearchParams,
    ApiResponse,
)
from app.services.affiliation_service import AffiliationService, get_affiliation_service


router = APIRouter()


@router.get("")
async def get_affiliations(
    params: Annotated[ApiPaginationSearchParams, Query()],
    affiliation_service: AffiliationService = Depends(get_affiliation_service),
) -> ApiPaginatedResponse[list[AffiliationListItem]]:
    data = await affiliation_service.get_affiliations(
        params.search_string, params.page, params.per_page
    )

    return ApiPaginatedResponse(data=data)


@router.post("")
async def create_affiliation(
    data: AffiliationInCreate,
    affiliation_service: AffiliationService = Depends(get_affiliation_service),
) -> ApiResponse[AffiliationResponse]:
    try:
        return ApiResponse(data=await affiliation_service.create_affiliation(data))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ApiErrorResponse(
                message=f"Affiliation '{data.name}' already exists"
            ).model_dump(),
        )


@router.get("/{id}")
async def get_affiliation_by_id(
    id: str, affiliation_service: AffiliationService = Depends(get_affiliation_service)
) -> ApiResponse[AffiliationResponse]:
    data = await affiliation_service.get_affiliation_by_id(id)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ApiErrorResponse(
                message=f"affiliation with id {id} does not exist"
            ).model_dump(),
        )

    return ApiResponse(data=data)

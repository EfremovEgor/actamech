from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.schemas.messages import  ApiPaginatedResponse, ApiPaginationSearchParams, ApiResponse
from app.schemas.proceeding import ProceedingResponse, ProceedingVolumeListItemResponse, ProceedingVolumeResponse
from app.services.proceeding_service import ProceedingService, ProceedingVolumeService, get_proceeding_service, get_proceeding_volume_service


router = APIRouter()
@router.get("/volumes")
async def get_all_volumes(params: Annotated[ApiPaginationSearchParams, Query()], 
                          proceeding_volume_service: ProceedingVolumeService = Depends(get_proceeding_volume_service))->ApiPaginatedResponse[list[ProceedingVolumeListItemResponse]]:
    data = await proceeding_volume_service.get_all_volumes(params.search_string, params.page, params.per_page)
    return ApiPaginatedResponse(data=data)

@router.get("/volumes/{id}", response_model=ApiResponse[ProceedingVolumeResponse])
async def get_proceeding_volume(id: str, proceeding_volume_service: ProceedingVolumeService = Depends(get_proceeding_volume_service)):
    return ApiResponse(data=await proceeding_volume_service.get_volume_by_id(id))

@router.get("/{id}", response_model=ApiResponse[ProceedingResponse])
async def get_proceeding(id: str, proceeding_service: ProceedingService = Depends(get_proceeding_service)):
    return ApiResponse(data=await proceeding_service.get_proceeding_by_id(id))





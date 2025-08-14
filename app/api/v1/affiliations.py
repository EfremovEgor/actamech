from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from app.database.database import get_async_session
from app.schemas.affiliation import AffiliationBase, AffiliationInCreate
from app.schemas.messages import ApiErrorResponse, ApiResponse
from app.services.affiliation_service import AffiliationService, get_affiliation_service


router = APIRouter(prefix="")

@router.get("", response_model=ApiResponse[list[AffiliationBase]])
async def get_all_affiliations(affiliation_service: AffiliationService = Depends(get_affiliation_service)):
    return ApiResponse(data=await affiliation_service.get_all_affiliations())


@router.post("")
async def add_affiliation(data:AffiliationInCreate,affiliation_service: AffiliationService = Depends(get_affiliation_service)):
    try:
        return await affiliation_service.create_affiliation(data)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=ApiErrorResponse(message=f"{data.name} already exists")) 
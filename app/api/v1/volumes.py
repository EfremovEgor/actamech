from fastapi import APIRouter, Depends

from app.schemas.messages import  ApiResponse
from app.schemas.proceeding import ProceedingResponse, ProceedingVolumeResponse
from app.services.proceeding_service import ProceedingService, ProceedingVolumeService, get_proceeding_service, get_proceeding_volume_service


router = APIRouter()


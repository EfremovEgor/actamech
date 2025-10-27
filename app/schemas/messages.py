from typing import Any, Optional
from typing import Generic, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel
from pydantic import BaseModel, ConfigDict

from app.core.config import get_app_settings

T = TypeVar("T")

class ApiErrorResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    message: str = "error"
    data: Optional[T] = None



class ApiResponse(GenericModel, Generic[T]):
    model_config = ConfigDict(
        from_attributes=True,
    )

    message: str = "success"
    data: Optional[T] = None
    

class PaginationMeta(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    total: int
    page: int
    per_page: int = get_app_settings().pagination_items_per_page
    pages: int
    
    

class ApiPaginatedResponseData(BaseModel, Generic[T]):
    model_config = ConfigDict(
        from_attributes=True,
    )
    meta: PaginationMeta
    items: T
    
class ApiPaginationParams(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    page: Optional[int] = 0
    per_page: Optional[int] = get_app_settings().pagination_items_per_page

class ApiPaginationSearchParams(ApiPaginationParams):
    search_string: Optional[str] = None
    
class ApiPaginatedResponse(ApiResponse):
    data: ApiPaginatedResponseData[T]
    
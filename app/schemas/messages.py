from typing import Any
from typing import Generic, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel
from pydantic import BaseModel, ConfigDict


class ApiErrorResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    message: str = "error"


T = TypeVar("T")

class ApiResponse(GenericModel, Generic[T]):
    model_config = ConfigDict(
        from_attributes=True,
    )

    message: str = "success"
    data: T
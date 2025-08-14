from datetime import datetime
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.utils import clean_spaces


class AffiliationBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: uuid.UUID
    name:str
    address:str
    country:str
    postal_code:str|None

        
class AffiliationInCreate(BaseModel):
    name:str
    address:str
    country:str
    postal_code:str|None
    
    @field_validator("name", "address", "country", "postal_code", mode="before")
    def normalize_spaces(cls, v):
        return clean_spaces(v)

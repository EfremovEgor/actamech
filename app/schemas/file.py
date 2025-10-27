from datetime import datetime
from typing import Any
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.utils import clean_spaces


class FileBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: uuid.UUID
    original_name: str
    stored_name: str
    extension: str
    path: str
    created_at:datetime 
    size_bytes:int
    hash: str

class FileInCreate(BaseModel):
    original_name: str
    extension: str
    path: str
    contents: bytes
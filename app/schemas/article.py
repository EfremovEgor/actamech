from datetime import datetime
from typing import Any
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.utils import clean_spaces


class ArticleBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: str
    title: str
    abstract: str
    keywords: list[str]
    received_at: datetime|None
    revised_at: datetime|None
    accepted_at: datetime|None
    published_at: datetime|None
    body: dict[str, Any]|None
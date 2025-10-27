from datetime import datetime
from typing import Optional
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.utils import clean_spaces


class AffiliationBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: uuid.UUID
    name: str
    address: str
    country: str
    postal_code: str | None
    city: str


class AffiliationInCreate(BaseModel):
    name: str
    address: str
    city: str
    country: str
    postal_code: Optional[str] | None = None

    @field_validator("name", "address", "country", "postal_code", mode="before")
    def normalize_spaces(cls, v):
        return clean_spaces(v)


class AffiliationListItem(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: uuid.UUID
    name: str
    country: str


class AffiliationAliasResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: int
    alias: str


class AffiliationClarificationResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: int
    faculty: str | None
    department: str | None


class AffiliationResponse(AffiliationBase):
    aliases: list[AffiliationAliasResponse] = []
    clarifications: list[AffiliationClarificationResponse] = []

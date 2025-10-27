from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas.affiliation import (
    AffiliationClarificationResponse,
    AffiliationResponse,
)


class MultipleAuthorsResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: uuid.UUID
    first_name: str
    last_name: str


class AuthorAffiliationClarificationResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: uuid.UUID
    name: str
    address: str
    country: str
    city: str
    postal_code: str | None
    clarification: Optional[AffiliationClarificationResponse] = None


class AuthorResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: uuid.UUID
    first_name: str
    last_name: str
    middle_name: Optional[str]
    email: Optional[str]
    scopus_id: Optional[str]
    orcid_id: Optional[str]
    created_at: datetime
    affiliations: list[AuthorAffiliationClarificationResponse] = []

    @model_validator(mode="before")
    @classmethod
    def build_affiliations(cls, data: any) -> any:
        if isinstance(data, dict):
            return data

        if hasattr(data, "affiliation_associations"):
            affiliations = []
            for association in data.affiliation_associations:
                affiliation = association.affiliation
                clarification = association.clarification

                affiliation_item = AuthorAffiliationItem(
                    id=affiliation.id,
                    name=affiliation.name,
                    address=affiliation.address,
                    city=affiliation.city,
                    country=affiliation.country,
                    postal_code=affiliation.postal_code,
                    clarification=(
                        AffiliationClarificationResponse.model_validate(clarification)
                        if clarification
                        else None
                    ),
                )
                affiliations.append(affiliation_item)

            data_dict = {
                key: getattr(data, key) for key in data.__mapper__.attrs.keys()
            }
            data_dict["affiliations"] = affiliations
            return data_dict

        return data


class AuthorUpdate(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    email: Optional[str] = None
    scopus_id: Optional[str] = None
    orcid_id: Optional[str] = None


class AuthorCreate(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    first_name: str = None
    last_name: str = None
    middle_name: Optional[str] = None
    email: Optional[str] = None
    scopus_id: Optional[str] = None
    orcid_id: Optional[str] = None


class AuthorAffiliationItem(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    author_affiliation_id: uuid.UUID
    affiliation_clarification_id: Optional[int] = None

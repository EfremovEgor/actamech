from datetime import datetime
from typing import Any, Literal, Optional
import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.utils import clean_spaces, generate_random_hex_string


class AffiliationClarificationInResponse(BaseModel):
    id: int
    faculty: str | None
    department: str | None

    model_config = ConfigDict(from_attributes=True)


class AffiliationAliasInResponse(BaseModel):
    id: int
    alias: str

    model_config = ConfigDict(from_attributes=True)


class AffiliationInAuthor(BaseModel):
    id: uuid.UUID
    name: str
    address: str
    country: str
    postal_code: str | None
    aliases: list[AffiliationAliasInResponse] = []
    clarifications: list[AffiliationClarificationInResponse] = []

    model_config = ConfigDict(from_attributes=True)


class AuthorInArticle(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    middle_name: str | None
    email: str | None
    scopus_id: str | None
    orcid_id: str | None
    affiliations: list[AffiliationInAuthor] = []

    model_config = ConfigDict(from_attributes=True)

class ArticleVolume(BaseModel):
    id: str
    volume_number: str
    title: str 
    published_at: datetime | None
    
    model_config = ConfigDict(from_attributes=True)

    
class ArticleBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: str
    title: str
    abstract: str
    pages_in_volume: str | None
    keywords: list[str]
    type: Literal["research_paper", "conference_paper"]
    editorial: bool
    doi: str | None
    received_at: datetime | None
    revised_at: datetime | None
    accepted_at: datetime | None
    published_at: datetime| None
    body: list[dict[str, Any]] | None


class SingleArticleResponse(ArticleBase):
    authors: list[AuthorInArticle] = []
    volume: Optional[ArticleVolume] = None

class ArticleInCreate(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: Optional[str] = Field(default_factory=lambda:f"UN-{generate_random_hex_string(16)}")
    title: Optional[str] = "New Article"
    doi: Optional[str] = None 
    abstract: Optional[str] = ""
    keywords: Optional[list[str]] = []
    authors: Optional[list[str]] = []
    type: Literal["research_paper", "conference_paper"] = "conference_paper"
    editorial: Optional[bool] = False

    @field_validator("id", "doi" ,"title", "abstract", "keywords", "type", mode="before")
    def normalize_spaces(cls, v):
        return clean_spaces(v)


class MultipleArticlesResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: str
    title: str
    doi: Optional[str] = None
     
     
class ArticleUpdate(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    
    id: Optional[str] = None
    title: Optional[str] = None
    abstract: Optional[str] = None
    pages_in_volume: Optional[str] = None
    keywords: Optional[list[str]] = None
    type: Optional[Literal["research_paper", "conference_paper"]] = None
    editorial: Optional[bool] = None
    doi: Optional[str] = None
    received_at: Optional[datetime] = None
    revised_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    body: Optional[list[dict[str, Any]]] = None
    volume_id: Optional[str] = None
    

    
    
    
from datetime import datetime
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.editor import BaseVolumeEditor
from app.utils import clean_spaces


class ProceedingBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: str
    title: str


class VolumeInProceeding(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: str
    title: str
    conference_full_name: str
    volume_number: str


class ProceedingResponse(ProceedingBase):
    model_config = ConfigDict(
        from_attributes=True,
    )
    volumes: list[VolumeInProceeding] = []


class AuthorInArticle(BaseModel):
    first_name: str
    last_name: str


class ArticleInVolume(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: str
    abstract: str
    doi: str | None
    title: str
    type: str
    editorial: bool
    published_at: datetime | None
    authors: list[AuthorInArticle] = []


class ProceedingVolumeResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    proceeding: ProceedingBase
    editors: list[BaseVolumeEditor] = []
    id: str
    title: str
    volume_number: str
    total_pages: str
    place: str
    description: str
    conference_full_name: str
    held_at: str
    published_at: datetime | None
    articles: list[ArticleInVolume] = []


class ProceedingVolumeListItemResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )
    id: str
    title: str
    volume_number: str

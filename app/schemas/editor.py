from datetime import datetime
from typing import Any, Literal, Optional
import uuid

from pydantic import BaseModel, ConfigDict, field_validator

from app.utils import clean_spaces


class BaseVolumeEditor(BaseModel):
    id: int
    prefix: str
    full_name: str | None
    title: str
    institution: str
    country: str

    model_config = ConfigDict(from_attributes=True)

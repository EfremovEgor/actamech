from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings,SettingsConfigDict # Use pydantic_settings for Pydantic v2+

class Settings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL")
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")



@lru_cache
def get_app_settings() -> Settings:
    return Settings()
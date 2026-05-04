from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Codebase Compass API"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/codebase_compass",
        alias="DATABASE_URL",
    )
    jwt_secret: str = Field(default="change-me-to-a-long-random-development-secret", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=15, alias="ACCESS_TOKEN_EXPIRE_MINUTES", ge=1, le=60)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

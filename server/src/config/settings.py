import logging
from functools import lru_cache
from typing import Optional, List
from pydantic import Field
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    # Database Settings
    MONGO_URL: str = Field(default="mongodb://localhost:27017")
    MONGODB_DB: str = Field(default="movie_review_db")
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Avatar settings
    DEFAULT_AVATAR_URL: str = "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
    # AVATAR_UPLOAD_DIR: str = "uploads/avatars"
    
    # Server Settings
    DEBUG: bool = Field(default=True)
    API_V1_PREFIX: str = Field(default="/api/v1")

    # TMDB Settings
    TMDB_API_KEY: Optional[str] = Field(default=None)
    TMDB_ACCESS_TOKEN: Optional[str] = Field(default=None)
    TMDB_API_BASE_URL: str = Field(default="https://api.themoviedb.org/3")

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore" 


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    """
    settings = Settings()
    logger.info(f"Loaded settings: {settings.model_dump()}")
    return settings


settings = get_settings()

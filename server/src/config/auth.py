import logging
from datetime import timedelta
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class AuthSettings(BaseSettings):
    # JWT settings
    JWT_SECRET_KEY: str = Field(...)
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)

    # Security settings
    BCRYPT_ROUNDS: int = Field(default=12)

    # Password Settings
    PASSWORD_MIN_LENGTH: int = Field(default=8)
    PASSWORD_REGEX: str = Field(
        default=r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")

    # Token Settings
    TOKEN_URL: str = Field(default="/token")
    TOKEN_TYPE: str = Field(default="bearer")

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore the additional fields


@lru_cache()
def get_auth_settings() -> AuthSettings:
    """
    Get cached auth settings instance.
    """
    settings = AuthSettings()
    logger.info(f"Loaded auth settings: {settings.model_dump()}")
    return settings


auth_settings = get_auth_settings()

# Token Expiration
ACCESS_TOKEN_EXPIRE = timedelta(
    minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
REFRESH_TOKEN_EXPIRE = timedelta(days=auth_settings.REFRESH_TOKEN_EXPIRE_DAYS)

# Security Settings
BCRYPT_ROUNDS = auth_settings.BCRYPT_ROUNDS

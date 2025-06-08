from pydantic import BaseModel
from .user import User


class Token(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    token_type: str


class TokenRefresh(BaseModel):
    """Token refresh request model"""
    refresh_token: str


class LoginRequest(BaseModel):
    """Login request model"""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Login response model"""
    user: User
    # access_token: AccessToken
    access_token: str
    refresh_token: str
    message: str = "Login successful!"
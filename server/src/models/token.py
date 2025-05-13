from pydantic import BaseModel


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
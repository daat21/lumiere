import re
from datetime import datetime
from typing import Optional, Dict, List, Any
from pydantic import BaseModel, EmailStr, Field, field_validator

USERNAME_REGEX = r'^[a-zA-Z0-9_]{3,20}$'
PASSWORD_REGEX = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$'

def validate_password(password: str) -> str:
    """Validate password format"""
    if not re.match(PASSWORD_REGEX, password):
        raise ValueError(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    return password

class UserCreate(BaseModel):
    """Model for creating a new user"""
    email: EmailStr
    username: str
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)

    @field_validator("username")
    def username_validator(cls, v):
        if not re.match(USERNAME_REGEX, v):
            raise ValueError(
                'Username must be 3-20 characters long and can only contain letters, numbers, and underscores')
        return v

    @field_validator("password")
    def password_validator(cls, v):
        return validate_password(v)
    
    @field_validator("confirm_password")
    def confirm_password_validator(cls, v, info):
        if v != info.data.get("password"):
            raise ValueError("Passwords do not match.")
        return v

class UserLogin(BaseModel):
    """Model for user login"""
    username: str
    password: str

class UserUpdate(BaseModel):
    """Model for updating user information"""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
    confirm_password: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

    @field_validator("username")
    def username_validator(cls, v):
        if not re.match(USERNAME_REGEX, v):
            raise ValueError(
                'Username must be 3-20 characters long and can only contain letters, numbers, and underscores')
        return v

    @field_validator("current_password")
    def current_password_validator(cls, v):
        if not v:
            raise ValueError("Current password is required.")
        return v
    
    @field_validator("new_password")
    def password_validator(cls, v):
        if v is not None:  # Only validate if new password is provided
            return validate_password(v)
        return v
    
    @field_validator("confirm_password")
    def confirm_password_validator(cls, v, info):
        if v != info.data.get("new_password"):
            raise ValueError("Passwords do not match.")
        return v

class User(BaseModel):
    """User model"""
    id: str
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    watchlists: List[Dict[str, Any]] = Field(default_factory=list)
    reviews: List[Dict[str, Any]] = Field(default_factory=list)

    class Config:
        from_attributes = True

    @field_validator("username")
    def username_validator(cls, v):
        if not re.match(USERNAME_REGEX, v):
            raise ValueError(
                'Username must be 3-20 characters long and can only contain letters, numbers, and underscores')
        return v

    @field_validator("avatar_url")
    def avatar_url_validator(cls, v):
        if v is not None:
            if not v.startswith(('http://', 'https://')):
                raise ValueError("Avatar URL must start with http:// or https://")
        return v



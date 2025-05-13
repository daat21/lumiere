import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    """Model for creating a new user"""
    email: EmailStr
    username: str
    password: str = Field(..., min_length=8)
    confirm_password: str

    @field_validator("username")
    def username_validator(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError(
                'Username must be 3-20 characters long and can only contain letters, numbers, and underscores')
        return v

    @field_validator("password")
    def password_validator(cls, v):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$', v):
            raise ValueError(
                'Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*#?&)')
        return v

    @field_validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values.data and v != values.data["password"]:
            raise ValueError("Passwords do not match")
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

    @field_validator("username")
    def username_validator(cls, v):
        if v is not None:
            if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
                raise ValueError(
                    'Username must be 3-20 characters long and can only contain letters, numbers, and underscores')
        return v


class User(BaseModel):
    """Complete user model"""
    # model_config = ConfigDict(from_attributes=True)
    
    id: str
    email: EmailStr
    username: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    preferences: dict = Field(default_factory=dict)

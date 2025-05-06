from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
import re


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    def username_validator(cls, v):
        # Ensure username contains at least one letter and alphanumeric
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$', v):
            raise ValueError('Username must contain at least one letter and alphanumeric, and be at least 6 characters long') 


class UserLogin(BaseModel):
    username: str
    password: str


class User(BaseModel):
    id: str
    email: str
    username: str
    is_active: bool

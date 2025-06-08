from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, field_validator


class Review(BaseModel):
    """Review model for storing user reviews"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "movie_id": "123456",
                "movie_title": "The Dark Knight",
                "user_id": "507f1f77bcf86cd799439012",
                "username": "john_doe",
                "rating": 8,
                "comment": "Great movie with amazing performances!",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": None
            }
        }
    )
    
    id: str = Field(..., alias="_id", description="Unique identifier for the review")
    movie_id: str = Field(..., min_length=1, description="TMDB ID of the movie")
    movie_title: str = Field(..., min_length=1, description="Title of the movie")
    user_id: str = Field(..., min_length=1, description="ID of the user who wrote the review")
    username: str = Field(..., min_length=1, max_length=50, description="Username of the reviewer")
    rating: int = Field(..., ge=0, le=10, description="Rating from 0 to 10 (integer)")
    comment: str = Field(..., min_length=1, max_length=1000, description="Review comment")
    created_at: datetime = Field(default_factory=datetime.now, description="When the review was created")
    updated_at: Optional[datetime] = Field(None, description="When the review was last updated")

    @field_validator('rating')
    def validate_rating(cls, v):
        """Validate rating is between 0 and 10"""
        if not 0 <= v <= 10:
            raise ValueError('Rating must be between 0 and 10')
        return int(v)

    @field_validator('comment')
    def validate_comment(cls, v):
        """Validate comment length and content"""
        if not v or not v.strip():
            raise ValueError('Comment cannot be empty')
        if len(v) > 1000:
            raise ValueError('Comment must be less than 1000 characters')
        return v.strip()


class ReviewCreate(BaseModel):
    """Model for creating a new review"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "rating": 8,
                "comment": "Great movie with amazing performances!"
            }
        }
    )
    
    rating: int = Field(..., ge=0, le=10, description="Rating from 0 to 10 (integer)")
    comment: str = Field(..., min_length=1, max_length=1000, description="Review comment")

    @field_validator('rating')
    def validate_rating(cls, v):
        """Validate rating is between 0 and 10"""
        if not 0 <= v <= 10:
            raise ValueError('Rating must be between 0 and 10')
        return int(v)

    @field_validator('comment')
    def validate_comment(cls, v):
        """Validate comment length and content"""
        if not v or not v.strip():
            raise ValueError('Comment cannot be empty')
        if len(v) > 1000:
            raise ValueError('Comment must be less than 1000 characters')
        return v.strip()


class ReviewUpdate(BaseModel):
    """Model for updating an existing review"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "rating": 9,
                "comment": "Updated review: Even better after watching it again!"
            }
        }
    )
    
    rating: Optional[int] = Field(None, ge=0, le=10, description="Updated rating from 0 to 10 (integer)")
    comment: Optional[str] = Field(None, min_length=1, max_length=1000, description="Updated review comment")

    @field_validator('rating')
    def validate_rating(cls, v):
        """Validate rating is between 0 and 10"""
        if v is not None and not 0 <= v <= 10:
            raise ValueError('Rating must be between 0 and 10')
        return int(v) if v is not None else v

    @field_validator('comment')
    def validate_comment(cls, v):
        """Validate comment length and content"""
        if v is not None:
            if not v.strip():
                raise ValueError('Comment cannot be empty')
            if len(v) > 1000:
                raise ValueError('Comment must be less than 1000 characters')
            return v.strip()
        return v
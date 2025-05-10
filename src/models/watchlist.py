from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class WatchlistMovie(BaseModel):
    """Movie in a watchlist"""
    movie_id: str
    added_at: datetime = Field(default_factory=datetime.now)
    notes: Optional[str] = None

class WatchlistCreate(BaseModel):
    """Create a new watchlist"""
    name: str
    description: Optional[str] = None
    is_public: bool = False

class WatchlistUpdate(BaseModel):
    """Update an existing watchlist"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class Watchlist(BaseModel):
    """Watchlist model"""
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    is_public: bool = False
    movies: List[WatchlistMovie] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "watchlist123",
                "user_id": "user123",
                "name": "My Favorite Movies",
                "description": "A collection of my favorite movies",
                "is_public": True,
                "movies": [
                    {
                        "movie_id": "123",
                        "added_at": "2024-01-01T00:00:00Z",
                        "notes": "Must watch!"
                    }
                ],
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        } 
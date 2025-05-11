from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

"""
This module contains models for TMDB movie data.
All fields and data structures are based on TMDB API responses.
"""

class TMDBReview(BaseModel):
    """TMDB API Movie Review Response Model"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "review1",
                "author": "John Doe",
                "content": "Great movie!",
                "created_at": "2024-01-01T00:00:00Z",
                "url": "https://example.com/review1",
                "author_details": {"rating": 8}
            }
        },
        arbitrary_types_allowed=True
    )
    
    id: str
    author: str
    content: str
    created_at: str
    url: Optional[str] = None
    author_details: Optional[Dict[str, Any]] = None

    @field_validator('created_at')
    def validate_date(cls, v):
        """Validate the date format"""
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError('Invalid date format')

class TMDBMovieResponse(BaseModel):
    """TMDB API movie Response model"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "123456",
                "title": "Example Movie",
                "original_title": "Example Movie",
                "overview": "This is an example movie",
                "poster_path": "/example.jpg",
                "backdrop_path": "/example_backdrop.jpg",
                "release_date": "2024-01-01",
                "genres": [{"id": 28, "name": "Action"}],
                "adult": False,
                "vote_average": 8.5,
                "vote_count": 1000,
                "popularity": 100.0,
                "original_language": "en"
            }
        },
        arbitrary_types_allowed=True,
        extra='ignore'
    )
    
    id: str
    title: str
    original_title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    genre_ids: Optional[List[int]] = Field(None, exclude=True)
    genres: Optional[List[Dict[str, Any]]] = None
    adult: bool = False
    vote_average: Optional[float] = Field(None, ge=0, le=10)
    vote_count: Optional[int] = Field(None, ge=0)
    popularity: Optional[float] = Field(None, ge=0)
    original_language: Optional[str] = None

    @field_validator('release_date')
    def validate_release_date(cls, v):
        """Validate the release date format"""
        if v is None:
            return v
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Invalid date format. Expected YYYY-MM-DD')

class TMDBMovieCastMember(BaseModel):
    """TMDB API Movie Cast Member Model"""
    id: int
    name: str
    character: str
    profile_path: Optional[str] = None
    order: Optional[int] = None

class TMDBMovieCrewMember(BaseModel):
    """TMDB API Movie Crew Member Model"""
    id: int
    name: str
    job: str
    department: str
    profile_path: Optional[str] = None

class TMDBMovieCreditsResponse(BaseModel):
    """TMDB API Movie Credits Response Model"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 123456,
                "cast": [
                    {
                        "id": 1,
                        "name": "Actor Name",
                        "character": "Character Name",
                        "profile_path": "/profile.jpg",
                        "order": 0
                    }
                ],
                "crew": [
                    {
                        "id": 2,
                        "name": "Director Name",
                        "job": "Director",
                        "department": "Directing",
                        "profile_path": "/profile.jpg"
                    }
                ]
            }
        }
    )
    
    id: int
    cast: List[TMDBMovieCastMember]
    crew: List[TMDBMovieCrewMember]

class TMDBMovieVideo(BaseModel):
    """TMDB API Movie Video Model"""
    id: str
    key: str
    name: str
    site: str
    type: str
    youtube_url: str
    published_at: Optional[str] = None

class TMDBMovieVideosResponse(BaseModel):
    """TMDB API Movie Videos Response Model"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 123456,
                "results": [
                    {
                        "id": "video1",
                        "key": "youtube_key",
                        "name": "Trailer",
                        "site": "YouTube",
                        "type": "Trailer",
                        "youtube_url": "https://www.youtube.com/watch?v=youtube_key",
                        "published_at": "2024-01-01T00:00:00Z"
                    }
                ]
            }
        }
    )
    
    id: int
    results: List[TMDBMovieVideo]

class TMDBMovieDetailResponse(TMDBMovieResponse):
    """TMDB API Movie Detail Response Model"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "123456",
                "title": "Example Movie",
                "original_title": "Example Movie",
                "overview": "This is an example movie",
                "poster_path": "/example.jpg",
                "backdrop_path": "/example_backdrop.jpg",
                "release_date": "2024-01-01",
                "genres": [{"id": 28, "name": "Action"}],
                "adult": False,
                "vote_average": 8.5,
                "vote_count": 1000,
                "popularity": 100.0,
                "original_language": "en",
                "budget": 1000000,
                "revenue": 5000000,
                "runtime": 120,
                "status": "Released",
                "tagline": "An example tagline",
                "production_companies": [{"id": 1, "name": "Example Studio"}],
                "production_countries": [{"iso_3166_1": "US", "name": "United States"}],
                "spoken_languages": [{"iso_639_1": "en", "name": "English"}],
                "reviews": [
                    {
                        "id": "review1",
                        "author": "John Doe",
                        "content": "Great movie!",
                        "created_at": "2024-01-01T00:00:00",
                        "url": "https://example.com/review1",
                        "author_details": {"rating": 8}
                    }
                ],
                "total_reviews": 100,
                "credits": {
                    "id": "123456",
                    "cast": [
                        {
                            "id": 1,
                            "name": "Actor Name",
                            "character": "Character Name",
                            "profile_path": "/profile.jpg",
                            "order": 0
                        }
                    ],
                    "crew": [
                        {
                            "id": 2,
                            "name": "Director Name",
                            "job": "Director",
                            "department": "Directing",
                            "profile_path": "/profile.jpg"
                        }
                    ]
                },
                "videos": {
                    "id": "123456",
                    "results": [
                        {
                            "id": "video1",
                            "key": "youtube_key",
                            "name": "Trailer",
                            "site": "YouTube",
                            "type": "Trailer",
                            "youtube_url": "https://www.youtube.com/watch?v=youtube_key",
                            "published_at": "2024-01-01T00:00:00Z"
                        }
                    ]
                }
            }
        }
    )
    
    budget: Optional[int] = Field(None, ge=0)
    revenue: Optional[int] = Field(None, ge=0)
    runtime: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None
    tagline: Optional[str] = None
    genres: Optional[List[Dict[str, Any]]] = None
    production_companies: Optional[List[Dict[str, Any]]] = None
    production_countries: Optional[List[Dict[str, Any]]] = None
    spoken_languages: Optional[List[Dict[str, Any]]] = None
    reviews: Optional[List[TMDBReview]] = None
    total_reviews: Optional[int] = Field(None, ge=0)
    credits: Optional[TMDBMovieCreditsResponse] = None
    videos: Optional[TMDBMovieVideosResponse] = None
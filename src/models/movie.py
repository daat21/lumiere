from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field

from .tmdb_movie import TMDBMovieResponse, TMDBReview


class MovieReview(BaseModel):
    """Movie Review model"""
    id: str
    author: str
    content: str
    created_at: str
    url: Optional[str] = None
    author_details: Optional[dict] = None
    source: str = "tmdb"

class Movie(BaseModel):
    """Movie database model"""
    _id: Optional[str] = None  # MongoDB ID
    tmdb_id: str  # TMDB ID
    title: str
    original_title: Optional[str] = None
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    genres: Optional[List[str]] = None
    genre_ids: Optional[List[int]] = None
    runtime: Optional[int] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    popularity: Optional[float] = None
    budget: Optional[int] = None
    revenue: Optional[int] = None
    tagline: Optional[str] = None
    adult: bool = False
    video: bool = False
    original_language: Optional[str] = None
    reviews: Optional[List[MovieReview]] = None
    total_reviews: Optional[int] = Field(None, ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @classmethod
    def from_tmdb_response(cls, tmdb_movie: TMDBMovieResponse) -> "Movie":
        """Create a movie record from the TMDB response"""
        reviews = None
        if tmdb_movie.reviews:
            reviews = [
                MovieReview(
                    id=review.id,
                    author=review.author,
                    content=review.content,
                    created_at=review.created_at,
                    url=review.url,
                    author_details=review.author_details
                )
                for review in tmdb_movie.reviews
            ]

        return cls(
            tmdb_id=str(tmdb_movie.id),
            title=tmdb_movie.title,
            original_title=tmdb_movie.original_title,
            overview=tmdb_movie.overview,
            poster_path=tmdb_movie.poster_path,
            backdrop_path=tmdb_movie.backdrop_path,
            release_date=tmdb_movie.release_date,
            genre_ids=tmdb_movie.genre_ids,
            adult=tmdb_movie.adult,
            video=tmdb_movie.video,
            vote_average=tmdb_movie.vote_average,
            vote_count=tmdb_movie.vote_count,
            popularity=tmdb_movie.popularity,
            original_language=tmdb_movie.original_language,
            reviews=reviews
        )

    class Config:
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "tmdb_id": "123456",
                "title": "Example Movie",
                "original_title": "Example Movie",
                "overview": "This is an example movie",
                "poster_path": "/example.jpg",
                "backdrop_path": "/example_backdrop.jpg",
                "release_date": "2024-01-01",
                "genres": ["Action", "Adventure"],
                "genre_ids": [28, 12],
                "runtime": 120,
                "vote_average": 8.5,
                "vote_count": 1000,
                "popularity": 100.0,
                "budget": 1000000,
                "revenue": 5000000,
                "tagline": "An example tagline",
                "adult": False,
                "video": False,
                "original_language": "en",
                "reviews": [
                    {
                        "id": "review1",
                        "author": "John Doe",
                        "content": "Great movie!",
                        "created_at": "2024-01-01T00:00:00",
                        "url": "https://example.com/review1",
                        "author_details": {"rating": 8},
                        "source": "tmdb"
                    }
                ],
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }

class MovieCreate(BaseModel):
    """Create a movie request model"""
    tmdb_id: str
    title: str
    overview: str

class MovieUpdate(BaseModel):
    """Update the movie request model"""
    title: Optional[str] = None
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    genres: Optional[List[str]] = None
    genre_ids: Optional[List[int]] = None
    runtime: Optional[int] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    popularity: Optional[float] = None
    budget: Optional[int] = None
    revenue: Optional[int] = None
    tagline: Optional[str] = None
    adult: Optional[bool] = None
    video: Optional[bool] = None
    original_language: Optional[str] = None 
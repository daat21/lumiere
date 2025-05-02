from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class MovieCastMember(BaseModel):
    id: str
    name: str
    character: Optional[str] = None
    profile_path: Optional[str] = None
    full_profile_path: Optional[str] = None

class MovieDirector(BaseModel):
    id: str
    name: str
    profile_path: Optional[str] = None
    full_profile_path: Optional[str] = None

class MovieReview(BaseModel):
    id: str
    author: str
    content: str
    created_at: str
    url: Optional[str] = None

class MovieVideo(BaseModel):
    id: str
    name: str
    key: str
    type: str
    site: str
    youtube_url: str

class Movie(BaseModel):
    id: Optional[str] = None
    tmdb_id: str
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    full_poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    full_backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    genres: Optional[List[str]] = None
    runtime: Optional[int] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    popularity: Optional[float] = None
    budget: Optional[int] = None
    revenue: Optional[int] = None
    tagline: Optional[str] = None
    cast: Optional[List[MovieCastMember]] = None
    directors: Optional[List[MovieDirector]] = None
    reviews: Optional[List[MovieReview]] = None
    videos: Optional[List[MovieVideo]] = None
    imported_at: Optional[datetime] = None

class MovieCreate(BaseModel):
    title: str
    overview: str
    tmdb_id: str

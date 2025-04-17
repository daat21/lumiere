# pylint: disable=missing-docstring
from typing import List, Optional
from pydantic import BaseModel, Field


class Review(BaseModel):
    author: str
    content: str
    rating: Optional[float] = None


class Movie(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    genre: List[str]
    year: Optional[int] = None
    average_rating: float
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    reviews: Optional[List[Review]] = None

    class Config:
        populate_by_name = True

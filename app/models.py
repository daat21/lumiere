from pydantic import BaseModel
from typing import Optional, List

class Review(BaseModel):
    user_id: str
    rating: float
    comment: str
    created_at: Optional[str] = None

class Movie(BaseModel):
    id: Optional[str]
    title: str
    genre:List[str]
    year: int
    director: str
    actors: List[str]
    average_rating: Optional[float]
    description: str
    reviews: Optional[List[Review]]=[]

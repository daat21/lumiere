# pylint: disable=missing-docstring
from typing import List, Optional
from pydantic import BaseModel

class Movie(BaseModel):
    # TMDb Movie ID
    id: str
    title: str
    genre: List[str]
    year: Optional[int] = None
    average_rating: float
    overview: Optional[str] = None

    class Config:
        extra = "ignore"

from pydantic import BaseModel
from typing import List, Optional

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
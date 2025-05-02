from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


class ReviewCreate(BaseModel):
    rating: float
    comment: str


class Review(BaseModel):
    id: str = Field(..., alias="_id")
    movie_id: str
    user_id: str
    rating: float
    comment: str

    @field_validator("id", mode="before")
    @classmethod
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str  # Globally process ObjectId conversion to strings
        }

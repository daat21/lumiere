from fastapi import APIRouter, HTTPException, Depends
from src.models.review import ReviewCreate, Review
from src.models.user import User
from src.database.mongodb import mongo
from src.services.review_service import ReviewService
from src.services.auth_service import AuthService
from typing import List
from bson import ObjectId

auth_service = AuthService()

# Create a router instance
router = APIRouter(prefix="/movies", tags=["reviews"])

# Initialize the ReviewService
review_service = ReviewService()


@router.post("/{movie_id}/reviews")
async def add_review(
    movie_id: str,
    review: ReviewCreate,
    current_user: User = Depends(auth_service.get_current_user)
):
    try:
        result = await review_service.create_review(movie_id, current_user.id, review)
        return {"message": "Review added successfully", "review_id": result.id}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{movie_id}/reviews")
async def get_movie_reviews(movie_id: str, skip: int = 0, limit: int = 10):
    try:
        reviews = await review_service.get_reviews(movie_id, skip, limit)
        return reviews
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{movie_id}/average-rating")
async def get_average_rating(movie_id: str):
    try:
        return await review_service.get_average_rating(movie_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{movie_id}/reviews/{review_id}")
async def delete_review(movie_id: str, review_id: str, current_user: User = Depends(auth_service.get_current_user)):
    try:
        result = await review_service.delete_review(movie_id, review_id, current_user.id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{movie_id}/reviews/{review_id}")
async def update_review(movie_id: str, review_id: str, review: ReviewCreate, current_user: User = Depends(auth_service.get_current_user)):
    try:
        result = await review_service.update_review(movie_id, review_id, review, current_user.id)
        return {"message": "Review updated successfully", "review": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error updating review: {str(e)}")


@router.get("/reviews/{review_id}")
async def get_review(review_id: str):
    try:
        review = await review_service.get_review(review_id)
        return review
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving review: {str(e)}")

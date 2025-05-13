from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.security import OAuth2PasswordBearer

from src.database.repositories.user import UserRepository
from src.models import Review, ReviewCreate, ReviewUpdate, User
from src.services import AuthService, ReviewService
from src.services.user_service import UserService
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)

router = APIRouter(
    tags=["reviews"],
    responses={
        404: {"description": "Resource not found"},
        403: {"description": "Not authorized"},
        400: {"description": "Invalid input"},
        500: {"description": "Internal server error"}
    }
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def get_review_service() -> ReviewService:
    return ReviewService()

async def get_auth_service() -> AuthService:
    user_repository = UserRepository()
    user_service = UserService(user_repository)
    return AuthService(user_service)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    return await auth_service.get_current_user(token)

@router.post(
    "/{movie_id}/reviews",
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, Any],
    summary="Add a new review",
    description="Create a new review for a movie. User must be authenticated."
)
async def add_review(
    movie_id: str,
    review: ReviewCreate,
    review_service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Add a new user review"""
    try:
        result = await review_service.create_review(
            movie_id=movie_id,
            user_id=str(current_user.id),
            username=current_user.username,
            review=review
        )
        return {
            "message": "Review added successfully",
            "review_id": result["_id"],
            "status": "success"
        }
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating review: {str(e)}"
        )

@router.get(
    "/{movie_id}/reviews",
    response_model=Dict[str, Any],
    summary="Get movie reviews",
    description="Get all reviews for a movie from both TMDB and our database with pagination."
)
async def get_movie_reviews(
    movie_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    include_tmdb: bool = Query(True),
    review_service: ReviewService = Depends(get_review_service)
) -> Dict[str, Any]:
    """Get reviews for a movie from both TMDB and our database"""
    try:
        return await review_service.get_movie_reviews(
            movie_id=movie_id,
            skip=skip,
            limit=limit,
            include_tmdb=include_tmdb
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving reviews: {str(e)}"
        )

@router.get(
    "/{movie_id}/average-rating",
    response_model=Dict[str, Any],
    summary="Get movie average rating",
    description="Get the average rating for a movie from both TMDB and our database."
)
async def get_movie_average_rating(
    movie_id: str,
    review_service: ReviewService = Depends(get_review_service)
) -> Dict[str, Any]:
    """Get average rating from both TMDB and our database"""
    try:
        return await review_service.get_movie_average_rating(movie_id)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating average rating: {str(e)}"
        )

@router.delete(
    "/{movie_id}/reviews/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a review",
    description="Delete a review. Only the review owner or admin can delete it."
)
async def delete_review(
    movie_id: str,
    review_id: str,
    review_service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(get_current_user)
):
    """Delete a review"""
    try:
        success = await review_service.delete_review(
            review_id=review_id,
            user_id=str(current_user.id),
            is_superuser=current_user.is_superuser
        )
        if not success:
            raise ResourceNotFoundError("Review not found")
    except (ResourceNotFoundError, UnauthorizedError) as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if isinstance(e, ResourceNotFoundError) else
                       status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting review: {str(e)}"
        )

@router.put(
    "/{movie_id}/reviews/{review_id}",
    response_model=Dict[str, Any],
    summary="Update a review",
    description="Update a review. Only the review owner or admin can update it."
)
async def update_review(
    movie_id: str,
    review_id: str,
    review: ReviewUpdate,
    review_service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Update a review"""
    try:
        result = await review_service.update_review(
            review_id=review_id,
            review=review,
            user_id=str(current_user.id),
            is_superuser=current_user.is_superuser
        )
        if not result:
            raise ResourceNotFoundError("Review not found")
        return {
            "message": "Review updated successfully",
            "review": result,
            "status": "success"
        }
    except (ResourceNotFoundError, UnauthorizedError, ValidationError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST if isinstance(e, ValidationError) else
                       status.HTTP_404_NOT_FOUND if isinstance(e, ResourceNotFoundError) else
                       status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating review: {str(e)}"
        )

@router.get("/users/me/reviews", 
            response_model=List[Dict[str, Any]],
            summary="Get all reviews for the current user",
            description="Get all reviews for the current user"
)
async def get_my_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    sort_by: str = Query("created_at", regex=r"^(created_at|rating|updated_at)$"),
    sort_order: int = Query(-1, ge=-1, le=1),
    review_service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get all reviews for the current user"""
    try:
        return await review_service.get_user_reviews(
            user_id=str(current_user.id),
            skip=skip,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving reviews: {str(e)}"
        )
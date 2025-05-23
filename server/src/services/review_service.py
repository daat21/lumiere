import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status
from src.database.repositories.review import ReviewRepository
from src.models import Review, ReviewCreate, ReviewUpdate
from src.services.tmdb_service import TMDBService
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)

logger = logging.getLogger(__name__)


class ReviewService:
    """Service for review-related operations"""

    def __init__(self):
        self.review_repository = ReviewRepository()
        self.tmdb_service = TMDBService()

    async def create_review(self, movie_id: str, user_id: str, username: str, review: ReviewCreate) -> Dict[str, Any]:
        """Create a new review"""
        try:
            # Validate movie_id format
            if not movie_id.isdigit():
                raise ValidationError("Invalid movie ID format")

            # Check if user already reviewed this movie
            existing_review = await self.get_user_review_for_movie(user_id, movie_id)
            if existing_review:
                raise ValidationError("User has already reviewed this movie")

            # Get movie title from TMDB
            try:
                movie_details = await self.tmdb_service.get_movie(movie_id)
                movie_title = movie_details.title if movie_details else "Unknown Movie"
            except Exception as e:
                logger.error(f"Error fetching movie title: {str(e)}")
                movie_title = "Unknown Movie"

            # Create review data
            review_data = review.model_dump()
            review_data.update({
                "movie_id": movie_id,
                "movie_title": movie_title,
                "user_id": user_id,
                "username": username,
                "created_at": datetime.now(),
                "updated_at": None
            })

            return await self.review_repository.create(review_data)
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

    async def get_review(self, review_id: str) -> Optional[Dict[str, Any]]:
        """Get a review by ID"""
        try:
            review = await self.review_repository.get_by_id(review_id)
            if not review:
                raise ResourceNotFoundError("Review not found")
            return review
        except ResourceNotFoundError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving review: {str(e)}"
            )

    async def update_review(self, review_id: str, user_id: str, is_superuser: bool, review: ReviewUpdate) -> Optional[Dict[str, Any]]:
        """Update a review"""
        try:
            # Get existing review
            existing_review = await self.get_review(review_id)
            if not existing_review:
                raise ResourceNotFoundError("Review not found")

            # Check if user owns the review or is admin
            if not is_superuser and existing_review["user_id"] != user_id:
                raise UnauthorizedError("Not authorized to update this review")

            # Validate update data
            if not review.model_dump(exclude_unset=True):
                raise ValidationError("No valid fields to update")

            # Update review data
            update_data = review.model_dump(exclude_unset=True)
            update_data["updated_at"] = datetime.now()

            return await self.review_repository.update(review_id, update_data)
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

    async def delete_review(self, review_id: str, user_id: str, is_superuser: bool) -> bool:
        """Delete a review"""
        try:
            # Get existing review
            existing_review = await self.get_review(review_id)
            if not existing_review:
                raise ResourceNotFoundError("Review not found")

            # Check if user owns the review or is admin
            if not is_superuser and existing_review["user_id"] != user_id:
                raise UnauthorizedError("Not authorized to delete this review")

            return await self.review_repository.delete(review_id)
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

    async def get_movie_reviews(
        self,
        movie_id: str,
        skip: int = 0,
        limit: int = 10,
        include_tmdb: bool = True
    ) -> Dict[str, Any]:
        """Get reviews for a movie from both TMDB and our database"""
        try:
            # Validate movie_id format
            if not movie_id.isdigit():
                raise ValidationError("Movie ID must be numeric")

            # Get user reviews from our database
            user_reviews = await self.review_repository.get_by_movie_id(
                movie_id=movie_id,
                skip=skip,
                limit=limit
            )

            # Get TMDB reviews if requested
            tmdb_reviews = []
            total_tmdb_reviews = 0
            if include_tmdb:
                try:
                    tmdb_reviews, total_tmdb_reviews = await self.tmdb_service.get_movie_reviews(
                        movie_id,
                        page=skip // limit + 1,
                        limit=limit
                    )
                except Exception as e:
                    logger.error(f"Error fetching TMDB reviews: {str(e)}")
                    # Continue without TMDB reviews if there's an error

            return {
                "user_reviews": user_reviews,
                "tmdb_reviews": [review.model_dump() for review in tmdb_reviews],
                "total_user_reviews": len(user_reviews),
                "total_tmdb_reviews": total_tmdb_reviews,
                "page": skip // limit + 1,
                "total_pages": (total_tmdb_reviews + limit - 1) // limit if total_tmdb_reviews > 0 else 0
            }
        except Exception as e:
            raise Exception(f"Error retrieving reviews: {str(e)}")

    async def get_user_reviews(
            self, 
            user_id: str, 
            skip: int = 0, 
            limit: int = 10, 
            sort_by: str = "created_at", 
            sort_order: int = -1) -> List[Dict[str, Any]]:
        """Get reviews by a user with pagination"""
        try:
            # Validate pagination parameters
            if skip < 0 or limit < 1 or limit > 50:
                raise ValidationError("Invalid pagination parameters")

            return await self.review_repository.get_by_user_id(user_id, skip, limit, sort_by, sort_order)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving user reviews: {str(e)}"
            )

    async def get_user_review_for_movie(self, user_id: str, movie_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's review for a specific movie"""
        try:
            # Validate movie_id format
            if not movie_id.isdigit():
                raise ValidationError("Invalid movie ID format")

            return await self.review_repository.get_user_review_for_movie(user_id, movie_id)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving user review: {str(e)}"
            )

    async def get_movie_average_rating(self, movie_id: str) -> Dict[str, Any]:
        """Get average rating from both TMDB and our database"""
        try:
            # Validate movie_id format
            if not movie_id.isdigit():
                raise ValidationError("Movie ID must be numeric")

            # Get TMDB rating first
            try:
                movie_details = await self.tmdb_service.get_movie(movie_id)
                tmdb_rating = movie_details.vote_average if movie_details else None
            except Exception as e:
                logger.error(f"Error fetching TMDB rating: {str(e)}")
                tmdb_rating = None

            # Get our database average rating
            db_rating = await self.review_repository.get_movie_average_rating(movie_id)

            return {
                "tmdb_rating": tmdb_rating,
                "user_rating": db_rating
            }
        except Exception as e:
            raise Exception(f"Error calculating average rating: {str(e)}")

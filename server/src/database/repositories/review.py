import asyncio
from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

from src.database.connection import mongo
from src.database.repositories.base import BaseRepository
from src.models import Review, ReviewCreate, ReviewUpdate
from src.utils.exceptions import ResourceNotFoundError, ValidationError


class ReviewRepository(BaseRepository[Review]):
    """Review repository with review-specific database operations"""

    def __init__(self):
        super().__init__(mongo.db, "reviews")
        self._indexes_created = False

    async def ensure_indexes(self):
        """Ensure required indexes exist"""
        if self._indexes_created:
            return

        # Ensure collection exists
        await self.ensure_collection()

        # Compound index for unique user review per movie
        await self.collection.create_index(
            [("movie_id", 1), ("user_id", 1)],
            unique=True,
            name="unique_user_movie_review"
        )

        # Index for movie reviews pagination
        await self.collection.create_index(
            [("movie_id", 1), ("created_at", -1)],
            name="movie_reviews_pagination"
        )

        # Index for user reviews pagination
        await self.collection.create_index(
            [("user_id", 1), ("created_at", -1)],
            name="user_reviews_pagination"
        )

        # Index for rating-based queries
        await self.collection.create_index(
            [("movie_id", 1), ("rating", -1)],
            name="movie_rating_sort"
        )

        # Index for movie title search
        await self.collection.create_index(
            [("movie_title", "text")],
            name="movie_title_search"
        )

        self._indexes_created = True

    async def create(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new review"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            # Validate required fields
            required_fields = ["movie_id", "movie_title", "user_id",
                               "username", "rating", "comment"]
            for field in required_fields:
                if field not in review_data:
                    raise ValidationError(f"Missing required field: {field}")

            # Ensure timestamps
            review_data["created_at"] = datetime.now()
            review_data["updated_at"] = None

            # Insert review
            result = await self.collection.insert_one(review_data)
            review_data["_id"] = str(result.inserted_id)
            return review_data
        except Exception as e:
            if "duplicate key error" in str(e).lower():
                raise ValidationError("User has already reviewed this movie")
            raise Exception(f"Error creating review: {str(e)}")

    async def get_by_movie_id(
        self,
        movie_id: str,
        skip: int = 0,
        limit: int = 10,
        sort_by: str = "created_at",
        sort_order: int = -1
    ) -> List[Dict[str, Any]]:
        """Get reviews for a movie with pagination and sorting"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            # Validate sort field
            valid_sort_fields = ["created_at", "rating", "updated_at"]
            if sort_by not in valid_sort_fields:
                raise ValidationError(
                    f"Invalid sort field. Must be one of: {', '.join(valid_sort_fields)}")

            cursor = self.collection.find(
                {"movie_id": movie_id},
                skip=skip,
                limit=limit,
                sort=[(sort_by, sort_order)]
            )
            reviews = await cursor.to_list(length=limit)

            # Convert ObjectId to string
            for review in reviews:
                review["_id"] = str(review["_id"])

            return reviews
        except Exception as e:
            raise Exception(f"Error getting movie reviews: {str(e)}")

    async def get_by_user_id(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 10,
        sort_by: str = "created_at",
        sort_order: int = -1
    ) -> List[Dict[str, Any]]:
        """Get reviews by a user with pagination and sorting"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            # Validate sort field
            valid_sort_fields = ["created_at", "rating", "updated_at"]
            if sort_by not in valid_sort_fields:
                raise ValidationError(
                    f"Invalid sort field. Must be one of: {', '.join(valid_sort_fields)}")

            cursor = self.collection.find(
                {"user_id": user_id},
                skip=skip,
                limit=limit,
                sort=[(sort_by, sort_order)]
            )
            reviews = await cursor.to_list(length=limit)

            # Convert ObjectId to string
            for review in reviews:
                review["_id"] = str(review["_id"])

            return reviews
        except Exception as e:
            raise Exception(f"Error getting user reviews: {str(e)}")

    async def get_user_review_for_movie(self, user_id: str, movie_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's review for a specific movie"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            review = await self.collection.find_one({
                "user_id": user_id,
                "movie_id": movie_id
            })

            if review:
                review["_id"] = str(review["_id"])

            return review
        except Exception as e:
            raise Exception(f"Error getting user review for movie: {str(e)}")

    async def update(self, review_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a review"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            # Validate review_id format
            if not ObjectId.is_valid(review_id):
                raise ValidationError("Invalid review ID format")

            # Add updated_at timestamp
            update_data["updated_at"] = datetime.now()

            # Update review
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(review_id)},
                {"$set": update_data},
                return_document=True
            )

            if not result:
                raise ResourceNotFoundError("Review not found")

            # Convert ObjectId to string
            result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            raise Exception(f"Error updating review: {str(e)}")

    async def delete(self, review_id: str) -> bool:
        """Delete a review"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            # Validate review_id format
            if not ObjectId.is_valid(review_id):
                raise ValidationError("Invalid review ID format")

            result = await self.collection.delete_one({"_id": ObjectId(review_id)})
            if result.deleted_count == 0:
                raise ResourceNotFoundError("Review not found")
            return True
        except Exception as e:
            raise Exception(f"Error deleting review: {str(e)}")

    async def get_movie_average_rating(self, movie_id: str) -> Dict[str, Any]:
        """Get average rating and review count for a movie"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            pipeline = [
                {"$match": {"movie_id": movie_id}},
                {"$group": {
                    "_id": None,
                    "average_rating": {"$avg": "$rating"},
                    "count": {"$sum": 1},
                    "ratings": {
                        "$push": "$rating"
                    }
                }},
                {"$project": {
                    "_id": 0,
                    "average_rating": {"$round": ["$average_rating", 1]},
                    "count": 1,
                    "rating_distribution": {
                        "$map": {
                            "input": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            "as": "rating",
                            "in": {
                                "rating": "$$rating",
                                "count": {
                                    "$size": {
                                        "$filter": {
                                            "input": "$ratings",
                                            "as": "r",
                                            "cond": {"$eq": ["$$r", "$$rating"]}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }}
            ]
            result = await self.collection.aggregate(pipeline).to_list(length=1)
            if not result:
                return {
                    "average_rating": 0.0,
                    "count": 0,
                    "rating_distribution": [
                        {"rating": i, "count": 0} for i in range(11)
                    ]
                }

            return result[0]
        except Exception as e:
            raise Exception(f"Error calculating average rating: {str(e)}")

    async def get_movie_review_count(self, movie_id: str) -> int:
        """Get total number of reviews for a movie"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            return await self.collection.count_documents({"movie_id": movie_id})
        except Exception as e:
            raise Exception(f"Error getting review count: {str(e)}")

    async def get_recent_reviews(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get most recent reviews across all movies"""
        try:
            # Ensure indexes are created
            await self.ensure_indexes()

            cursor = self.collection.find(
                {},
                sort=[("created_at", -1)],
                limit=limit
            )
            reviews = await cursor.to_list(length=limit)

            # Convert ObjectId to string
            for review in reviews:
                review["_id"] = str(review["_id"])

            return reviews
        except Exception as e:
            raise Exception(f"Error getting recent reviews: {str(e)}")

    # async def get_top_rated_movies(self, limit: int = 10) -> List[Dict[str, Any]]:
    #     """Get top rated movies based on average rating"""
    #     try:
    #         pipeline = [
    #             {"$group": {
    #                 "_id": "$movie_id",
    #                 "average_rating": {"$avg": "$rating"},
    #                 "count": {"$sum": 1}
    #             }},
    #             {"$match": {
    #                 "count": {"$gte": 5}  # Only include movies with at least 5 reviews
    #             }},
    #             {"$sort": {"average_rating": -1}},
    #             {"$limit": limit}
    #         ]
    #         return await self.collection.aggregate(pipeline).to_list(length=limit)
    #     except Exception as e:
    #         raise Exception(f"Error getting top rated movies: {str(e)}")

from bson import ObjectId
from src.database.mongodb import mongo
from src.models.review import ReviewCreate, Review
from fastapi import HTTPException


class ReviewService:
    async def create_review(self, movie_id: str, user_id: str, review_data: ReviewCreate) -> Review:
        """
        Create a new review for a movie.
        """
        # Check a new review for a movie.
        movie = await mongo.movies_collection.find_one({"_id": ObjectId(movie_id)})
        if not movie:
            raise HTTPException(
                status_code=404, detail=f"Movie with id {movie_id} not found")

        # Create a new review
        review_dict = {
            "movie_id": movie_id,
            "user_id": user_id,
            "rating": review_data.rating,
            "comment": review_data.comment
        }

        # Insert into database
        result = await mongo.reviews_collection.insert_one(review_dict)

        # Return created review
        return Review(
            id=str(result.inserted_id),
            movie_id=movie_id,
            user_id=user_id,
            rating=review_data.rating,
            comment=review_data.comment
        )

    async def get_reviews(self, movie_id: str, skip: int = 0, limit: int = 10):
        """
        Get reviews for a specific movie with pagination.
        """
        # Check if movie exists
        movie = await mongo.movies_collection.find_one({"_id": ObjectId(movie_id)})
        if not movie:
            raise HTTPException(
                status_code=404, detail=f"Movie with id {movie_id} not found")

        # Get reviews for database
        cursor = mongo.reviews_collection.find(
            {"movie_id": movie_id}).skip(skip).limit(limit)
        reviews = []

        async for review in cursor:
            reviews.append(Review(
                id=str(review["_id"]),
                movie_id=review["movie_id"],
                user_id=review["user_id"],
                rating=review["rating"],
                comment=review["comment"]
            ))

        return reviews

    async def get_average_rating(self, movie_id: str):
        """
        Get the average rating for a specific movie.
        """
        try:
            # Check if movie exists
            movie = await mongo.movies_collection.find_one({"_id": ObjectId(movie_id)})
            if not movie:
                raise HTTPException(
                    status_code=404, detail=f"Movie with id {movie_id} not found")
            # Get reviews for database
            cursor = await mongo.reviews_collection.find({"movie_id": movie_id}).to_list(None)

            # If no reviews, return 0 as average rating
            if not cursor:
                return {
                    "movie_id": movie_id,
                    "average_rating": 0.0,
                    "total_reviews": 0
                }

            # Calculate average rating
            total_rating = sum(review["rating"] for review in cursor)
            average_rating = total_rating / len(cursor)
            return {
                "movie_id": movie_id,
                "average_rating": round(average_rating, 2),
                "total_reviews": len(cursor)
            }
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Invalid movie ID format: {str(e)}")

    async def get_review(self, review_id: str):
        """
        Get a review by its ID.
        """
        try:
            review = await mongo.reviews_collection.find_one({"_id": ObjectId(review_id)})
            if not review:
                raise HTTPException(
                    status_code=404, detail=f"Review with id {review_id} not found")

            return Review(
                id=str(review["_id"]),
                movie_id=review["movie_id"],
                user_id=review["user_id"],
                rating=review["rating"],
                comment=review["comment"]
            )
        except Exception as e:
            raise HTTPException(
                status_code=400, detail="Invalid review ID format")

    async def update_review(self, review_id: str, user_id: str, review_data: ReviewCreate):
        """
        Update a review by its ID.
        """
        # Get the review
        try:
            review = await mongo.reviews_collection.find_one({"_id": ObjectId(review_id)})
            if not review:
                raise HTTPException(
                    status_code=404, detail=f"Review with id {review_id} not found")

            # Check if the user is the owner of the review
            if review["user_id"] != user_id:
                raise HTTPException(
                    status_code=403, detail="You are not authorized to update this review")

            # Update the review
            update_data = {
                "rating": review_data.rating,
                "comment": review_data.comment
            }

            await mongo.reviews_collection.update_one(
                {"_id": ObjectId(review_id)},
                {"$set": update_data}
            )

            # Return the updated review
            return Review(
                id=str(review["_id"]),
                movie_id=review["movie_id"],
                user_id=review["user_id"],
                rating=review_data.rating,
                comment=review_data.comment
            )
        except Exception as e:
            raise HTTPException(
                status_code=400, detail="Invalid review ID format")

    async def delete_review(self, review_id: str, user_id: str):
        """
        Delete a review by its ID.
        """
        try:
            # Get the review
            review = await mongo.reviews_collection.find_one({"_id": ObjectId(review_id)})
            if not review:
                raise HTTPException(
                    status_code=404, detail=f"Review with id {review_id} not found")

            # Check if the user is the owner of the review
            if review["user_id"] != user_id:
                raise HTTPException(
                    status_code=403, detail="You are not authorized to delete this review")

            # Delete the review
            result = await mongo.reviews_collection.delete_one({"_id": ObjectId(review_id)})
            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=404, detail=f"Review with id {review_id} not found")
            return {"message": "Review deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail="Invalid review ID format")

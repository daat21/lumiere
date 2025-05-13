from datetime import datetime
from typing import Any, Dict, List, Optional

from src.database.connection import mongo
from src.database.repositories.base import BaseRepository
from src.models.watchlist import Watchlist, WatchlistMovie
from src.utils.exceptions import ResourceNotFoundError, ValidationError


class WatchlistRepository(BaseRepository):
    """Repository for watchlist operations"""

    def __init__(self):
        super().__init__(mongo.db, "watchlists")

    async def ensure_indexes(self):
        """Ensure required indexes exist"""
        await self.ensure_collection()
        await self._collection.create_index([("user_id", 1), ("name", 1)], unique=True)
        await self._collection.create_index([("user_id", 1), ("created_at", -1)])
        await self._collection.create_index([("is_public", 1), ("created_at", -1)])

    async def create(self, watchlist_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new watchlist"""
        try:
            # Validate required fields
            if not watchlist_data.get("user_id") or not watchlist_data.get("name"):
                raise ValidationError("User ID and name are required")

            # Check if watchlist with same name exists for user
            existing = await self._collection.find_one({
                "user_id": watchlist_data["user_id"],
                "name": watchlist_data["name"]
            })
            if existing:
                raise ValidationError(
                    "Watchlist with this name already exists")

            # Add timestamps
            now = datetime.now()
            watchlist_data.update({
                "created_at": now,
                "updated_at": now,
                "movies": []
            })

            result = await self._collection.insert_one(watchlist_data)
            watchlist_data["_id"] = str(result.inserted_id)
            return watchlist_data
        except Exception as e:
            raise Exception(f"Error creating watchlist: {str(e)}")

    async def get_by_id(self, watchlist_id: str) -> Optional[Dict[str, Any]]:
        """Get a watchlist by ID"""
        try:
            watchlist = await self._collection.find_one({"_id": self.to_object_id(watchlist_id)})
            if watchlist:
                watchlist["_id"] = str(watchlist["_id"])
            return watchlist
        except Exception as e:
            raise Exception(f"Error retrieving watchlist: {str(e)}")

    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """Get all watchlists for a user with pagination"""
        try:
            cursor = self._collection.find({"user_id": user_id}) \
                .sort("created_at", -1) \
                .skip(skip) \
                .limit(limit)

            watchlists = []
            async for watchlist in cursor:
                watchlist["_id"] = str(watchlist["_id"])
                watchlists.append(watchlist)

            return watchlists
        except Exception as e:
            raise Exception(f"Error retrieving user watchlists: {str(e)}")

    async def update(self, watchlist_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a watchlist"""
        try:
            # Validate update data
            if not update_data:
                raise ValidationError("No valid fields to update")

            # Check if name is being updated and if it already exists
            if "name" in update_data:
                existing = await self._collection.find_one({
                    "user_id": update_data.get("user_id"),
                    "name": update_data["name"],
                    "_id": {"$ne": self.to_object_id(watchlist_id)}
                })
                if existing:
                    raise ValidationError(
                        "Watchlist with this name already exists")

            # Add updated timestamp
            update_data["updated_at"] = datetime.now()

            result = await self._collection.find_one_and_update(
                {"_id": self.to_object_id(watchlist_id)},
                {"$set": update_data},
                return_document=True
            )

            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            raise Exception(f"Error updating watchlist: {str(e)}")

    async def delete(self, watchlist_id: str) -> bool:
        """Delete a watchlist"""
        try:
            result = await self._collection.delete_one({"_id": self.to_object_id(watchlist_id)})
            return result.deleted_count > 0
        except Exception as e:
            raise Exception(f"Error deleting watchlist: {str(e)}")

    async def add_movie(self, watchlist_id: str, movie: WatchlistMovie) -> Optional[Dict[str, Any]]:
        """Add a movie to a watchlist"""
        try:
            # Check if movie already exists in watchlist
            watchlist = await self.get_by_id(watchlist_id)
            if not watchlist:
                raise ResourceNotFoundError("Watchlist not found")

            for existing_movie in watchlist.get("movies", []):
                if existing_movie["movie_id"] == movie.movie_id:
                    raise ValidationError("Movie already in watchlist")

            # Add movie to watchlist
            result = await self._collection.find_one_and_update(
                {"_id": self.to_object_id(watchlist_id)},
                {
                    "$push": {"movies": movie.model_dump()},
                    "$set": {"updated_at": datetime.now()}
                },
                return_document=True
            )

            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            raise Exception(f"Error adding movie to watchlist: {str(e)}")

    async def remove_movie(self, watchlist_id: str, movie_id: str) -> Optional[Dict[str, Any]]:
        """Remove a movie from a watchlist"""
        try:
            result = await self._collection.find_one_and_update(
                {"_id": self.to_object_id(watchlist_id)},
                {
                    "$pull": {"movies": {"movie_id": movie_id}},
                    "$set": {"updated_at": datetime.now()}
                },
                return_document=True
            )

            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            raise Exception(f"Error removing movie from watchlist: {str(e)}")

    async def get_public_watchlists(self, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """Get public watchlists with pagination"""
        try:
            cursor = self._collection.find({"is_public": True}) \
                .sort("created_at", -1) \
                .skip(skip) \
                .limit(limit)

            watchlists = []
            async for watchlist in cursor:
                watchlist["_id"] = str(watchlist["_id"])
                watchlists.append(watchlist)

            return watchlists
        except Exception as e:
            raise Exception(f"Error retrieving public watchlists: {str(e)}")

import logging
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status
from src.database.repositories.watchlist import WatchlistRepository
from src.models.watchlist import (WatchlistCreate, WatchlistMovie,
                                  WatchlistUpdate)
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)

logger = logging.getLogger(__name__)


class WatchlistService:
    """Service for watchlist operations"""

    def __init__(self):
        self.watchlist_repository = WatchlistRepository()

    async def create_watchlist(self, user_id: str, watchlist: WatchlistCreate) -> Dict[str, Any]:
        """Create a new watchlist"""
        try:
            watchlist_data = watchlist.model_dump()
            watchlist_data["user_id"] = user_id
            return await self.watchlist_repository.create(watchlist_data)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating watchlist: {str(e)}"
            )

    async def get_watchlist(self, watchlist_id: str, user_id: str) -> Dict[str, Any]:
        """Get a watchlist by ID"""
        try:
            watchlist = await self.watchlist_repository.get_by_id(watchlist_id)
            if not watchlist:
                raise ResourceNotFoundError("Watchlist not found")

            # Check if user has access to the watchlist
            if watchlist["user_id"] != user_id and not watchlist.get("is_public", False):
                raise UnauthorizedError(
                    "Not authorized to access this watchlist")

            return watchlist
        except (ResourceNotFoundError, UnauthorizedError) as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND if isinstance(e, ResourceNotFoundError) else
                status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving watchlist: {str(e)}"
            )

    async def get_user_watchlists(self, user_id: str, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """Get all watchlists for a user"""
        try:
            return await self.watchlist_repository.get_by_user_id(user_id, skip, limit)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving user watchlists: {str(e)}"
            )

    async def update_watchlist(self, watchlist_id: str, user_id: str, watchlist: WatchlistUpdate) -> Dict[str, Any]:
        """Update a watchlist"""
        try:
            # Get existing watchlist
            existing = await self.get_watchlist(watchlist_id, user_id)
            if not existing:
                raise ResourceNotFoundError("Watchlist not found")

            # Check if user owns the watchlist
            if existing["user_id"] != user_id:
                raise UnauthorizedError(
                    "Not authorized to update this watchlist")

            # Update watchlist
            update_data = watchlist.model_dump(exclude_unset=True)
            result = await self.watchlist_repository.update(watchlist_id, update_data)
            if not result:
                raise ResourceNotFoundError("Watchlist not found")

            return result
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
                detail=f"Error updating watchlist: {str(e)}"
            )

    async def delete_watchlist(self, watchlist_id: str, user_id: str) -> bool:
        """Delete a watchlist"""
        try:
            # Get existing watchlist
            existing = await self.get_watchlist(watchlist_id, user_id)
            if not existing:
                raise ResourceNotFoundError("Watchlist not found")

            # Check if user owns the watchlist
            if existing["user_id"] != user_id:
                raise UnauthorizedError(
                    "Not authorized to delete this watchlist")

            return await self.watchlist_repository.delete(watchlist_id)
        except (ResourceNotFoundError, UnauthorizedError) as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND if isinstance(e, ResourceNotFoundError) else
                status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting watchlist: {str(e)}"
            )

    async def add_movie_to_watchlist(self, watchlist_id: str, user_id: str, movie: WatchlistMovie) -> Dict[str, Any]:
        """Add a movie to a watchlist"""
        try:
            # Get existing watchlist
            existing = await self.get_watchlist(watchlist_id, user_id)
            if not existing:
                raise ResourceNotFoundError("Watchlist not found")

            # Check if user owns the watchlist
            if existing["user_id"] != user_id:
                raise UnauthorizedError(
                    "Not authorized to modify this watchlist")

            return await self.watchlist_repository.add_movie(watchlist_id, movie)
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
                detail=f"Error adding movie to watchlist: {str(e)}"
            )

    async def remove_movie_from_watchlist(self, watchlist_id: str, user_id: str, movie_id: str) -> Dict[str, Any]:
        """Remove a movie from a watchlist"""
        try:
            # Get existing watchlist
            existing = await self.get_watchlist(watchlist_id, user_id)
            if not existing:
                raise ResourceNotFoundError("Watchlist not found")

            # Check if user owns the watchlist
            if existing["user_id"] != user_id:
                raise UnauthorizedError(
                    "Not authorized to modify this watchlist")

            return await self.watchlist_repository.remove_movie(watchlist_id, movie_id)
        except (ResourceNotFoundError, UnauthorizedError) as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND if isinstance(e, ResourceNotFoundError) else
                status.HTTP_403_FORBIDDEN,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error removing movie from watchlist: {str(e)}"
            )

    async def get_public_watchlists(self, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """Get public watchlists"""
        try:
            return await self.watchlist_repository.get_public_watchlists(skip, limit)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving public watchlists: {str(e)}"
            )

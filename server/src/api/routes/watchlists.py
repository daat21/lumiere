from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.security import OAuth2PasswordBearer

from src.models.user import User
from src.models.watchlist import (WatchlistCreate, WatchlistMovie,
                                  WatchlistUpdate)
from src.services import WatchlistService
from src.services.auth_service import AuthService
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_watchlist_service():
    return WatchlistService()

def get_auth_service():
    return AuthService()

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    return await auth_service.get_current_user(token)

# Create a router instance with prefix and tags
router = APIRouter(
    prefix="/watchlists",
    tags=["watchlists"],
    responses={
        404: {"description": "Resource not found"},
        403: {"description": "Not authorized"},
        400: {"description": "Invalid input"},
        500: {"description": "Internal server error"}
    }
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=Dict[str, Any],
    summary="Create a new watchlist",
    description="Create a new watchlist for the current user."
)
async def create_watchlist(
    watchlist: WatchlistCreate,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a new watchlist"""
    try:
        result = await watchlist_service.create_watchlist(
            user_id=current_user.id,
            watchlist=watchlist
        )
        return {
            "message": "Watchlist created successfully",
            "watchlist_id": result["_id"],
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
            detail=f"Error creating watchlist: {str(e)}"
        )

@router.get(
    "",
    response_model=List[Dict[str, Any]],
    summary="Get user's watchlists",
    description="Get all watchlists for the current user with pagination."
)
async def get_user_watchlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get all watchlists for the current user"""
    try:
        return await watchlist_service.get_user_watchlists(
            user_id=current_user.id,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving watchlists: {str(e)}"
        )

@router.get(
    "/public",
    response_model=List[Dict[str, Any]],
    summary="Get public watchlists",
    description="Get all public watchlists with pagination."
)
async def get_public_watchlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    watchlist_service: WatchlistService = Depends(get_watchlist_service)
) -> List[Dict[str, Any]]:
    """Get all public watchlists"""
    try:
        return await watchlist_service.get_public_watchlists(skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving public watchlists: {str(e)}"
        )

@router.get(
    "/{watchlist_id}",
    response_model=Dict[str, Any],
    summary="Get a watchlist",
    description="Get a specific watchlist by ID. User must own the watchlist or it must be public."
)
async def get_watchlist(
    watchlist_id: str,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get a specific watchlist"""
    try:
        watchlist = await watchlist_service.get_watchlist(
            watchlist_id=watchlist_id,
            user_id=current_user.id
        )
        if not watchlist:
            raise ResourceNotFoundError("Watchlist not found")
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

@router.put(
    "/{watchlist_id}",
    response_model=Dict[str, Any],
    summary="Update a watchlist",
    description="Update a watchlist. User must own the watchlist."
)
async def update_watchlist(
    watchlist_id: str,
    watchlist: WatchlistUpdate,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Update a watchlist"""
    try:
        existing = await watchlist_service.get_watchlist(watchlist_id, current_user.id)
        if not existing:
            raise ResourceNotFoundError("Watchlist not found")
        if existing["user_id"] != current_user.id:
            raise UnauthorizedError("Not authorized to update this watchlist")
        result = await watchlist_service.update_watchlist(
            watchlist_id=watchlist_id,
            user_id=current_user.id,
            watchlist=watchlist
        )
        return {
            "message": "Watchlist updated successfully",
            "watchlist": result,
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
            detail=f"Error updating watchlist: {str(e)}"
        )

@router.delete(
    "/{watchlist_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a watchlist",
    description="Delete a watchlist. User must own the watchlist."
)
async def delete_watchlist(
    watchlist_id: str,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
):
    """Delete a watchlist"""
    try:
        existing = await watchlist_service.get_watchlist(watchlist_id, current_user.id)
        if not existing:
            raise ResourceNotFoundError("Watchlist not found")
        if existing["user_id"] != current_user.id:
            raise UnauthorizedError("Not authorized to delete this watchlist")
        await watchlist_service.delete_watchlist(watchlist_id, current_user.id)
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

@router.post(
    "/{watchlist_id}/movies",
    response_model=Dict[str, Any],
    summary="Add a movie to watchlist",
    description="Add a movie to a watchlist. User must own the watchlist."
)
async def add_movie_to_watchlist(
    watchlist_id: str,
    movie: WatchlistMovie,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Add a movie to a watchlist"""
    try:
        result = await watchlist_service.add_movie_to_watchlist(
            watchlist_id=watchlist_id,
            user_id=current_user.id,
            movie=movie
        )
        return {
            "message": "Movie added to watchlist successfully",
            "watchlist": result,
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
            detail=f"Error adding movie to watchlist: {str(e)}"
        )

@router.delete(
    "/{watchlist_id}/movies/{movie_id}",
    response_model=Dict[str, Any],
    summary="Remove a movie from watchlist",
    description="Remove a movie from a watchlist. User must own the watchlist."
)
async def remove_movie_from_watchlist(
    watchlist_id: str,
    movie_id: str,
    watchlist_service: WatchlistService = Depends(get_watchlist_service),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Remove a movie from a watchlist"""
    try:
        result = await watchlist_service.remove_movie_from_watchlist(
            watchlist_id=watchlist_id,
            user_id=current_user.id,
            movie_id=movie_id
        )
        return {
            "message": "Movie removed from watchlist successfully",
            "watchlist": result,
            "status": "success"
        }
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
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from src.database.repositories.user import UserRepository
from src.models.user import User, UserCreate, UserLogin, UserUpdate
from src.services.auth_service import AuthService
from src.services.user_service import UserService
from src.services.review_service import ReviewService
from src.services.watchlist_service import WatchlistService
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)

router = APIRouter(tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_user_service() -> UserService:
    user_repository = UserRepository()
    return UserService(user_repository)

def get_auth_service() -> AuthService:
    user_repository = UserRepository()
    user_service = UserService(user_repository)
    return AuthService(user_service)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    return await auth_service.get_current_user(token)

# Register a new user
@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        user_service = get_user_service()
        return await user_service.create_user(user_data)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

# Create admin user (protected route)
@router.post("/admin/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_admin_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    """Register a new admin user (only accessible by existing admins)"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create admin users"
        )
    try:
        user_service = get_user_service()
        return await user_service.create_admin_user(user_data)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating admin user: {str(e)}"
        )

# List all users (admin only)
@router.get("/", response_model=List[User])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    """List all users (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to list users"
        )
    user_service = get_user_service()
    return await user_service.list_users(skip=skip, limit=limit)

# Get current user information
@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    # Query the user's watchlists
    watchlist_service = WatchlistService()
    user_watchlists = await watchlist_service.get_user_watchlists(user_id=current_user.id)

    # Query the user's reviews
    review_service = ReviewService()
    user_reviews = await review_service.get_user_reviews(user_id = current_user.id)

    # Create the user with the watchlists and reviews
    user_dict = current_user.model_dump()
    user_dict["watchlists"] = user_watchlists
    user_dict["reviews"] = user_reviews
    
    return user_dict

# Update current user information
@router.patch("/me", response_model=User)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    user_service = get_user_service()
    return await user_service.update_user(str(current_user.id), user_data, current_user)

# Delete current user account
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_user)
):
    user_service = get_user_service()
    await user_service.delete_user(str(current_user.id), current_user)

@router.post("/avatar", status_code=status.HTTP_200_OK)
async def upload_avatar(
    avatar_url: str,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Update user avatar URL, e.g. https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg
    """
    try:
        avatar_url = await user_service.upload_avatar(str(current_user.id), avatar_url)
        return {"avatar_url": avatar_url}
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating avatar: {str(e)}"
        )

@router.delete("/avatar", status_code=status.HTTP_204_NO_CONTENT)
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Reset user avatar to default
    """
    try:
        await user_service.delete_avatar(current_user.id)
        return {"message": "Avatar deleted successfully."}
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting avatar: {str(e)}"
        )

@router.put("/bio", status_code=status.HTTP_200_OK)
async def update_bio(
    bio: str,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Update user bio
    """
    try:
        bio = await user_service.update_bio(str(current_user.id), bio)
        return {"bio": bio}
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating bio: {str(e)}"
        )

@router.get("/me/activity", response_model=Dict[str, Any])
async def get_user_activity(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 10
):
    """
    Get user activity, including reviews and watchlists
    """
    # Get user's reviews
    review_service = ReviewService()
    user_reviews = await review_service.get_user_reviews(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
# Get user's watchlists
    watchlist_service = WatchlistService()
    user_watchlists = await watchlist_service.get_user_watchlists(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )

    # Create activity list
    activities = []

    # Add reviews to activity
    for review in user_reviews:
        if review.get("movie_id"):
            activities.append({
                "id": str(review["_id"]),
                "type": "review",
                "rating": review["rating"],
                "comment": review["comment"],
                "movie_id": review["movie_id"],
                "created_at": review["created_at"]
            })
    # Add watchlists to activity
    for watchlist in user_watchlists:
        for movie in watchlist.get("movies", []):
            if movie.get("movie_id"):
                activities.append({
                    "id": f"{watchlist['_id']}_{movie['movie_id']}",
                    "type": "watchlist",
                    "movie_id": movie["movie_id"],
                    "created_at": movie.get("added_at", watchlist["created_at"])
                })

    # Sort activity by created_at in descending order
    activities.sort(key=lambda x: x["created_at"], reverse=True)

    return {
        "activities": activities,
        "total_reviews": len(user_reviews),
        "total_favorites": sum(len(w.get("movies", [])) for w in user_watchlists)
    }


# Backend management and administrator operations

# Get user information by ID
@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Only accessible by the administrator.
    """
    if str(current_user.id) != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    user_service = get_user_service()
    return await user_service.get_user_by_id(user_id)

# Update user information by ID
@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Only accessible by the administrator.
    """
    user_service = get_user_service()
    return await user_service.update_user(user_id, user_data, current_user)

# Delete user account by ID
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Only accessible by the administrator.
    """
    user_service = get_user_service()
    await user_service.delete_user(user_id, current_user)


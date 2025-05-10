from enum import Enum
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from src.models import (TMDBMovieCreditsResponse, TMDBMovieDetailResponse,
                        TMDBMovieResponse, TMDBMovieVideosResponse, TMDBReview)
from src.services.tmdb_service import TMDBService
from src.utils import MovieNotFoundError, RateLimitError, UnauthorizedError


def get_tmdb_service():
    return TMDBService()

router = APIRouter(tags=["movies"])

class SortBy(str, Enum):
    """Sort by options for movies"""
    POPULARITY = "popularity"
    VOTE_AVERAGE = "vote_average"
    RELEASE_DATE = "release_date"

@router.get(
    "/movies",
    response_model=List[TMDBMovieResponse],
    summary="Get a list of movies",
    description="Retrieve a list of movies with optional filtering and sorting options.",
    responses={
        200: {"description": "List of movies retrieved successfully"},
        400: {"description": "Invalid parameters"},
        401: {"description": "Unauthorized access"},
        429: {"description": "Too many requests"},
        500: {"description": "Internal server error"}
    }
)
async def get_movies(
    skip: int = Query(0, ge=0, description="Number of movies to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of movies to return"),
    genre: Optional[str] = Query(None, description="Filter movies by genre"),
    sort_by: Optional[SortBy] = Query(
        None,
        description="Sort movies by the specified criteria"
    ),
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Get a list of movies with optional filtering and sorting."""
    try:
        if genre:
            return await tmdb_service.get_movies_by_genre(genre, limit)
        elif sort_by == SortBy.VOTE_AVERAGE:
            return await tmdb_service.get_top_rated_movies(limit)
        elif sort_by == SortBy.RELEASE_DATE:
            return await tmdb_service.get_latest_movies(limit)
        else:
            return await tmdb_service.get_popular_movies(limit)
    except UnauthorizedError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )
    except RateLimitError:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving movies: {str(e)}"
        )

@router.get(
    "/movies/search",
    response_model=List[TMDBMovieResponse],
    summary="Search for movies",
    description="Search for movies with various filters and sorting options. Returns basic movie information.",
    responses={
        200: {"description": "Movies found successfully"},
        400: {"description": "Invalid search parameters"},
        401: {"description": "Unauthorized access"},
        429: {"description": "Too many requests"},
        500: {"description": "Internal server error"}
    }
)
async def search_movies(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    language: str = Query("en-US", description="Language code"),
    include_adult: bool = Query(False, description="Include adult content"),
    year: Optional[int] = Query(None, description="Release year"),
    primary_release_year: Optional[int] = Query(None, description="Primary release year"),
    region: Optional[str] = Query(None, description="Region code"),
    with_genres: Optional[List[int]] = Query(None, description="Genre IDs"),
    sort_by: Optional[str] = Query(
        None,
        description="Sort by field (e.g., popularity.desc, release_date.desc, vote_average.desc)"
    ),
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Search for movies with various filters and sorting options."""
    try:
        return await tmdb_service.search_movies(
            query=q,
            page=page,
            language=language,
            include_adult=include_adult,
            year=year,
            primary_release_year=primary_release_year,
            region=region,
            with_genres=with_genres,
            sort_by=sort_by
        )
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except RateLimitError as e:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching movies: {str(e)}"
        )

@router.get(
    "/movies/tmdb/{tmdb_id}",
    response_model=TMDBMovieDetailResponse,
    summary="Get movie by TMDB ID",
    description="Retrieve detailed information about a movie using its TMDB ID.",
    responses={
        200: {"description": "Movie found successfully"},
        404: {"description": "Movie not found"},
        401: {"description": "Unauthorized access"},
        429: {"description": "Too many requests"},
        500: {"description": "Internal server error"}
    }
)
async def get_movie_by_tmdb_id(
    tmdb_id: str = Path(..., description="TMDB ID of the movie"),
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Get a movie by TMDB ID."""
    try:
        movie = await tmdb_service.get_movie_with_details(tmdb_id)
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )
        return movie
    except UnauthorizedError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )
    except RateLimitError:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving movie: {str(e)}"
        )

@router.get(
    "/genres",
    response_model=List[str],
    summary="Get all genres",
    description="Retrieve a list of all available movie genres.",
    responses={
        200: {"description": "Genres retrieved successfully"},
        401: {"description": "Unauthorized access"},
        429: {"description": "Too many requests"},
        500: {"description": "Internal server error"}
    }
)
async def get_genres(
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Get a list of all unique genres."""
    try:
        genres = await tmdb_service.get_genres()
        return [genre["name"] for genre in genres]
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except RateLimitError as e:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving genres: {str(e)}"
        )

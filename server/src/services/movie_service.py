from typing import List, Optional
from src.models.tmdb_movie import (TMDBMovieCreditsResponse,
                                   TMDBMovieDetailResponse, TMDBMovieResponse,
                                   TMDBMovieVideosResponse)
from src.services.tmdb_service import TMDBService

# from src.database.repositories.movie import MovieRepository


class MovieService:
    """Service for movie-related operations"""

    # def __init__(self, tmdb_service: TMDBService, movie_repository: MovieRepository):
    def __init__(self, tmdb_service: TMDBService):
        self.tmdb_service = tmdb_service
        # self.movie_repository = movie_repository

    async def get_movie(self, tmdb_id: str) -> Optional[TMDBMovieResponse]:
        """Get basic movie information from TMDB"""
        return await self.tmdb_service.get_movie(tmdb_id)

    async def get_movie_with_details(self, tmdb_id: str) -> Optional[TMDBMovieDetailResponse]:
        """Get detailed movie information including reviews, credits, and videos"""
        return await self.tmdb_service.get_movie_with_details(tmdb_id)

    async def get_movie_credits(self, tmdb_id: str) -> Optional[TMDBMovieCreditsResponse]:
        """Get movie credits (cast and crew)"""
        return await self.tmdb_service.get_movie_credits(tmdb_id)

    async def get_movie_videos(self, tmdb_id: str) -> Optional[TMDBMovieVideosResponse]:
        """Get movie videos (trailers, etc.)"""
        return await self.tmdb_service.get_movie_videos(tmdb_id)

    async def search_movies(self, query: str, limit: int = 20) -> List[TMDBMovieResponse]:
        """Search movies by title"""
        # Calculate page number based on limit
        page = 1  # For now, we'll just get the first page
        return await self.tmdb_service.search_movies(query, page)

    async def get_popular_movies(self, limit: int = 20) -> List[TMDBMovieResponse]:
        """Get popular movies"""
        return await self.tmdb_service.get_popular_movies(limit)

    async def get_top_rated_movies(self, limit: int = 20) -> List[TMDBMovieResponse]:
        """Get top rated movies"""
        return await self.tmdb_service.get_top_rated_movies(limit)

    async def get_movies_by_genre(self, genre: str, limit: int = 20) -> List[TMDBMovieResponse]:
        """Get movies by genre"""
        return await self.tmdb_service.get_movies_by_genre(genre, limit)

    async def get_movies_by_year(self, year: int, limit: int = 20) -> List[TMDBMovieResponse]:
        """Get movies by release year"""
        return await self.tmdb_service.get_movies_by_year(year, limit)

    async def get_genres(self) -> List[str]:
        """Get a list of all unique genres"""
        genres = await self.tmdb_service.get_genres()
        return [genre["name"] for genre in genres]

    # # MongoDB-specific methods (kept for backward compatibility)
    # async def create_movie(self, movie: MovieCreate) -> Optional[Dict[str, Any]]:
    #     """Create a new movie in MongoDB"""
    #     return await self.movie_repository.create(movie)

    # async def update_movie(self, movie_id: str, movie: MovieCreate) -> Optional[Dict[str, Any]]:
    #     """Update a movie in MongoDB"""
    #     return await self.movie_repository.update(movie_id, movie)

    # async def delete_movie(self, movie_id: str) -> bool:
    #     """Delete a movie from MongoDB"""
    #     return await self.movie_repository.delete(movie_id)

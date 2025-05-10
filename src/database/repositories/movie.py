from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

from src.models.movie import Movie, MovieCreate, MovieUpdate
from src.models.tmdb_movie import TMDBMovieResponse

from .base import BaseRepository


class MovieRepository(BaseRepository):
    """Movie warehouse category"""

    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "movies")

    async def initialize(self):
        """Initialize the index"""
        await self.collection.create_index("tmdb_id", unique=True)
        await self.collection.create_index("title")
        await self.collection.create_index("release_date")
        await self.collection.create_index("genres")
        await self.collection.create_index("vote_average")
        await self.collection.create_index("popularity")

    async def create_from_tmdb(self, tmdb_movie: TMDBMovieResponse) -> Movie:
        """Create movie records from TMDB data"""
        movie = Movie.from_tmdb_response(tmdb_movie)
        return await self.create(movie.model_dump(exclude_none=True))

    async def get_by_tmdb_id(self, tmdb_id: str) -> Optional[Movie]:
        """Obtain the movie through TMDB ID"""
        data = await self.collection.find_one({"tmdb_id": tmdb_id})
        return Movie(**data) if data else None

    async def update_from_tmdb(self, tmdb_id: str, tmdb_movie: TMDBMovieResponse) -> Optional[Movie]:
        """Update movie records from TMDB data"""
        movie = Movie.from_tmdb_response(tmdb_movie)
        movie.updated_at = datetime.now(timezone.utc)
        data = await self.collection.find_one_and_update(
            {"tmdb_id": tmdb_id},
            {"$set": movie.model_dump(exclude_none=True)},
            return_document=True
        )
        return Movie(**data) if data else None

    async def search(self, query: str, limit: int = 10) -> List[Movie]:
        """Search movies"""
        cursor = self.collection.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit)

        movies = []
        async for doc in cursor:
            movies.append(Movie(**doc))
        return movies

    async def get_popular(self, limit: int = 10) -> List[Movie]:
        """Get popular movies"""
        cursor = self.collection.find().sort("popularity", -1).limit(limit)
        movies = []
        async for doc in cursor:
            movies.append(Movie(**doc))
        return movies

    async def get_by_genre(self, genre: str, limit: int = 10) -> List[Movie]:
        """Get movies of a specific genre"""
        cursor = self.collection.find({"genres": genre}).sort(
            "popularity", -1).limit(limit)
        movies = []
        async for doc in cursor:
            movies.append(Movie(**doc))
        return movies

    async def get_by_title(self, title: str) -> Optional[Dict[str, Any]]:
        """Get movie by title"""
        return await self.collection.find_one({"title": title})

    async def search_movies(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search movies by title"""
        cursor = self.collection.find(
            {"title": {"$regex": query, "$options": "i"}}
        ).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_movies_by_year(self, year: int, limit: int = 20) -> List[Dict[str, Any]]:
        """Get movies by release year"""
        start_date = f"{year}-01-01"
        end_date = f"{year}-12-31"
        cursor = self.collection.find(
            {
                "release_date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
        ).sort("popularity", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_top_rated_movies(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get top rated movies"""
        cursor = self.collection.find(
            # Only include movies with sufficient votes
            {"vote_count": {"$gte": 100}}
        ).sort("vote_average", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_genres(self) -> List[str]:
        """Get a list of all unique genres"""
        pipeline = [
            {"$unwind": "$genres"},
            {"$group": {"_id": "$genres"}},
            {"$sort": {"_id": 1}}
        ]
        cursor = self.collection.aggregate(pipeline)
        genres = await cursor.to_list(length=None)
        return [genre["_id"] for genre in genres]

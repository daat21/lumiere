# pylint: disable=missing-docstring
from typing import List, Optional
from movie_platform.models import Movie


async def get_movie_by_id(movies_collection, movie_id: str) -> Optional[Movie]:
    """
    Fetch a single movie document by its string ID.
    """
    movie = await movies_collection.find_one({"_id": movie_id})
    if movie:
        return Movie(**movie)
    return None


async def list_movies(movies_collection, limit: int = 10) -> List[Movie]:
    """
    List movie documents with optional limit.
    """
    cursor = movies_collection.find().limit(limit)
    movies = []
    async for movie in cursor:
        movies.append(Movie(**movie))
    return movies

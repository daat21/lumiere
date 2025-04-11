# pylint: disable=missing-module-docstring
# pylint: disable=missing-class-docstring
# pylint: disable=missing-function-docstring
# from motor.motor_asyncio import AsyncIOMotorCollection
# from app.models import Movie
# from typing import Optional

async def get_movie_by_id(movies_collection, movie_id: str):
    return await movies_collection.find_one({"id": movie_id})


async def list_movies(movies_collection, limit: int = 10):
    cursor = movies_collection.find().limit(limit)
    movies = []
    async for movie in cursor:
        movies.append(movie)
    return movies

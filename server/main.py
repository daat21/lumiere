# pylint: disable=missing-docstring
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, HTTPException
from server.database import mongo
from server import crud as app_crud
from server.models import Movie


# Define Lifespan event
@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup: Initialize database connection
    await mongo.connect()
    yield
    # Shutdown: Close database connection
    await mongo.close()

# Create a FastAPI application and pass lifespan
movie_app = FastAPI(
    title="Movie Platform API",
    description="API for querying movie data",
    version="1.0.0",
    lifespan=lifespan
)


# Test endpoint
@movie_app.get("/movies/{movie_id}", response_model=Movie, summary="Get a movie by ID")
async def get_movie_endpoint(movie_id: str):
    movie = await app_crud.get_movie_by_id(mongo.movies_collection, movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@movie_app.get("/movies", response_model=List[Movie])
async def list_movies_endpoint():
    if mongo.movies_collection is None:
        raise RuntimeError("movies_collection is None. Database not initialized.")
    movies = await app_crud.list_movies(mongo.movies_collection)
    return movies

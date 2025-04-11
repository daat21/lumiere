# pylint: disable=missing-docstring
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, HTTPException
from app import database as app_database
from app import crud as app_crud
from app.models import Movie
# from typing import List, Union
# from fastapi import Uvicorn


# Define Lifespan event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database connection
    await app_database.init_db()
    yield
    # Shutdown: Close database connection
    await app_database.close_db()

# Create a FastAPI application and pass lifespan
app = FastAPI(
    title="Movie Platform API",
    description="API for querying movie data",
    version="1.0.0",
    lifespan=lifespan
)


# Test endpoint
@app.get("/movies/{movie_id}", response_model=Movie)
async def get_movie_endpoint(movie_id: str):
    movie = await app_crud.get_movie_by_id(app_database.movies_collection, movie_id)
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie


@app.get("/movies", response_model=List[Movie])
async def list_movies_endpoint():
    movies = await app_crud.list_movies(app_database.movies_collection)
    return movies

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from src.models.movie import Movie
from src.database.mongodb import mongo
from bson import ObjectId

router = APIRouter(tags=["movies"])

@router.get("/movies", response_model=List[Movie])
async def get_movies(
    skip: int = 0, 
    limit: int = 10,
    genre: Optional[str] = None,
    sort_by: Optional[str] = Query(None, enum=["popularity", "vote_average", "release_date"])
):
    """Get a list of movies with optional filtering and sorting."""
    query = {}
    if genre:
        query["genres"] = genre
    
    # Define sort order
    sort_order = [("popularity", -1)]  # Default sort by popularity
    if sort_by == "vote_average":
        sort_order = [("vote_average", -1)]
    elif sort_by == "release_date":
        sort_order = [("release_date", -1)]
    
    cursor = mongo.movies_collection.find(query).sort(sort_order).skip(skip).limit(limit)
    movies = []
    async for movie in cursor:
        movie["id"] = str(movie["_id"])
        
        # Convert cast IDs from int to string
        if "cast" in movie and movie["cast"]:
            for cast_member in movie["cast"]:
                if "id" in cast_member and isinstance(cast_member["id"], int):
                    cast_member["id"] = str(cast_member["id"])
        
        # Convert director IDs from int to string
        if "directors" in movie and movie["directors"]:
            for director in movie["directors"]:
                if "id" in director and isinstance(director["id"], int):
                    director["id"] = str(director["id"])
        
        movies.append(Movie(**movie))
    return movies


@router.get("/movies/search", response_model=List[Movie])
async def search_movies(q: str, skip: int = 0, limit: int = 10):
    """Search for movies by title or overview."""
    try:
        # Use a simple regex search instead of text search
        cursor = mongo.movies_collection.find(
            {"title": {"$regex": q, "$options": "i"}}
        ).skip(skip).limit(limit)
        
        movies = []
        async for movie in cursor:
            movie["id"] = str(movie["_id"])
            
            # Convert cast IDs from int to string
            if "cast" in movie and movie["cast"]:
                for cast_member in movie["cast"]:
                    if "id" in cast_member and isinstance(cast_member["id"], int):
                        cast_member["id"] = str(cast_member["id"])
            
            # Convert director IDs from int to string
            if "directors" in movie and movie["directors"]:
                for director in movie["directors"]:
                    if "id" in director and isinstance(director["id"], int):
                        director["id"] = str(director["id"])
                        
            movies.append(Movie(**movie))
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")


@router.get("/movies/tmdb/{tmdb_id}", response_model=Movie)
async def get_movie_by_tmdb_id(tmdb_id: str):
    """Get a movie by TMDB ID."""
    try:
        movie = await mongo.movies_collection.find_one({"tmdb_id": tmdb_id})
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Convert cast IDs from int to string
        if "cast" in movie and movie["cast"]:
            for cast_member in movie["cast"]:
                if "id" in cast_member and isinstance(cast_member["id"], int):
                    cast_member["id"] = str(cast_member["id"])
        
        # Convert director IDs from int to string
        if "directors" in movie and movie["directors"]:
            for director in movie["directors"]:
                if "id" in director and isinstance(director["id"], int):
                    director["id"] = str(director["id"])
                    
        movie["id"] = str(movie["_id"])
        return Movie(**movie)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid TMDB ID: {str(e)}")


@router.get("/movies/{movie_id}", response_model=Movie)
async def get_movie(movie_id: str):
    """Get a movie by ID."""
    try:
        movie = await mongo.movies_collection.find_one({"_id": ObjectId(movie_id)})
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Convert cast IDs from int to string
        if "cast" in movie and movie["cast"]:
            for cast_member in movie["cast"]:
                if "id" in cast_member and isinstance(cast_member["id"], int):
                    cast_member["id"] = str(cast_member["id"])
        
        # Convert director IDs from int to string
        if "directors" in movie and movie["directors"]:
            for director in movie["directors"]:
                if "id" in director and isinstance(director["id"], int):
                    director["id"] = str(director["id"])
                    
        movie["id"] = str(movie["_id"])
        return Movie(**movie)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid movie ID: {str(e)}")


@router.get("/genres", response_model=List[str])
async def get_genres():
    """Get a list of all unique genres."""
    try:
        genres = await mongo.movies_collection.distinct("genres")
        # Filter out any None values and ensure all items are strings
        genres = [str(genre) for genre in genres if genre is not None]
        return genres
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving genres: {str(e)}")

from bson import ObjectId
from src.database.mongodb import mongo
from src.models.movie import Movie
from fastapi import HTTPException
from typing import List, Optional


class MovieService:
    async def get_movie_by_id(self, movie_id: str) -> Movie:
        """
        Get a movie by its ID.
        
        Args:
            movie_id: The ID of the movie
            
        Returns:
            The movie object
            
        Raises:
            HTTPException: If the movie doesn't exist or the movie_id format is invalid
        """
        try:
            movie = await mongo.movies_collection.find_one({"_id": ObjectId(movie_id)})
            if not movie:
                raise HTTPException(status_code=404, detail=f"Movie with id {movie_id} not found")
                
            return Movie(
                id=str(movie["_id"]),
                tmdb_id=movie.get("tmdb_id", ""),
                title=movie["title"],
                overview=movie["overview"]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid movie ID format: {str(e)}")
    
    async def search_movies(self, query: Optional[str] = None, skip: int = 0, limit: int = 10) -> List[Movie]:
        """
        Search for movies by title.
        
        Args:
            query: The search query (optional)
            skip: Number of records to skip (for pagination)
            limit: Maximum number of records to return (for pagination)
            
        Returns:
            A list of movies matching the search criteria
        """
        try:
            if query:
                # Case-insensitive search by title
                cursor = mongo.movies_collection.find(
                    {"title": {"$regex": query, "$options": "i"}}
                ).skip(skip).limit(limit)
            else:
                # If no query is provided, return all movies with pagination
                cursor = mongo.movies_collection.find().skip(skip).limit(limit)
                
            movies = []
            async for movie in cursor:
                movies.append(Movie(
                    id=str(movie["_id"]),
                    tmdb_id=movie.get("tmdb_id", ""),
                    title=movie["title"],
                    overview=movie["overview"]
                ))
                
            return movies
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")
    
    async def get_popular_movies(self, limit: int = 10) -> List[Movie]:
        """
        Get popular movies (this is a placeholder - in a real application, 
        you might determine popularity by number of views, ratings, etc.)
        
        Args:
            limit: Maximum number of movies to return
            
        Returns:
            A list of popular movies
        """
        try:
            cursor = mongo.movies_collection.find().sort("_id", -1).limit(limit)
            
            movies = []
            async for movie in cursor:
                movies.append(Movie(
                    id=str(movie["_id"]),
                    tmdb_id=movie.get("tmdb_id", ""),
                    title=movie["title"],
                    overview=movie["overview"]
                ))
                
            return movies
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving popular movies: {str(e)}")
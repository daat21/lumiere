import aiohttp
import asyncio
import os
import sys
import argparse
from datetime import datetime
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from src.database.mongodb import mongo
load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"


async def fetch_movies(page: int = 1, category: str = "popular"):
    """
    Fetch movies from TMDB API.
    
    Args:
        page: Page number to fetch
        category: Movie category (popular, top_rated, upcoming, now_playing)
    """
    valid_categories = ["popular", "top_rated", "upcoming", "now_playing"]
    if category not in valid_categories:
        print(f"Invalid category: {category}. Using 'popular' instead.")
        category = "popular"
        
    url = f"https://api.themoviedb.org/3/movie/{category}?api_key={TMDB_API_KEY}&page={page}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                raise Exception(f"Failed to fetch movies from TMDB API: {response.status} - {await response.text()}")
            data = await response.json()
            print(f"Successfully fetched {len(data['results'])} movies from page {page}")
            return data["results"]


async def fetch_movie_details(movie_id: int):
    """
    Fetch detailed information about a movie including credits and reviews.
    
    Args:
        movie_id: TMDB movie ID
    """
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits,reviews,videos"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status != 200:
                print(f"Failed to fetch details for movie ID {movie_id}: {response.status}")
                return None
            return await response.json()


async def clear_movies_collection():
    """Clear all existing movies from the database."""
    await mongo.connect()
    try:
        result = await mongo.movies_collection.delete_many({})
        print(f"Deleted {result.deleted_count} movies from the database")
    finally:
        await mongo.close()


async def import_movies_to_db(pages: int = 5, category: str = "popular", clear_existing: bool = False):
    """
    Import movies from TMDB API to MongoDB.
    
    Args:
        pages: Number of pages to import
        category: Movie category to import
        clear_existing: Whether to clear existing movies before import
    """
    await mongo.connect()
    
    try:
        # Create indexes for efficient queries
        await mongo.movies_collection.create_index([("tmdb_id", 1)], unique=True)
        await mongo.movies_collection.create_index([("title", "text"), ("overview", "text")])
        await mongo.movies_collection.create_index([("genres", 1)])
        await mongo.movies_collection.create_index([("popularity", -1)])
        
        # Clear existing movies if requested
        if clear_existing:
            result = await mongo.movies_collection.delete_many({})
            print(f"Cleared {result.deleted_count} existing movies from the database")
        
        total_imported = 0
        total_existing = 0
        total_errors = 0
        
        # Get movies from specified number of pages
        for page in range(1, pages + 1):
            try:
                movies = await fetch_movies(page, category)
                movie_docs = []
                
                for movie in movies:
                    # Check whether the movie already exists (via TMDB ID)
                    tmdb_id = str(movie["id"])
                    existing_movie = await mongo.movies_collection.find_one({"tmdb_id": tmdb_id})
                    
                    if existing_movie:
                        print(f"Movie already exists: {movie['title']} (TMDB ID: {tmdb_id})")
                        total_existing += 1
                        continue
                    
                    # Fetch additional details for the movie
                    details = await fetch_movie_details(movie["id"])
                    
                    # Create the basic movie document
                    movie_doc = {
                        "tmdb_id": tmdb_id,
                        "title": movie["title"],
                        "overview": movie["overview"],
                        "poster_path": movie.get("poster_path"),
                        "backdrop_path": movie.get("backdrop_path"),
                        "release_date": movie.get("release_date"),
                        "vote_average": movie.get("vote_average"),
                        "vote_count": movie.get("vote_count"),
                        "popularity": movie.get("popularity")
                    }
                    
                    # Add additional details if available
                    if details:
                        # Add genres
                        if "genres" in details:
                            movie_doc["genres"] = [genre["name"] for genre in details["genres"]]
                        
                        # Add runtime, budget, etc.
                        movie_doc["runtime"] = details.get("runtime")
                        movie_doc["budget"] = details.get("budget")
                        movie_doc["revenue"] = details.get("revenue")
                        
                        # Add cast (top 10 cast members)
                        if "credits" in details and "cast" in details["credits"]:
                            cast = []
                            for cast_member in details["credits"]["cast"][:10]:  # Limit to top 10
                                cast.append({
                                    "id": cast_member["id"],
                                    "name": cast_member["name"],
                                    "character": cast_member.get("character", ""),
                                    "profile_path": cast_member.get("profile_path"),
                                    "full_profile_path": f"{IMAGE_BASE_URL}{cast_member.get('profile_path')}" if cast_member.get("profile_path") else None
                                })
                            movie_doc["cast"] = cast
                        
                        # Add directors
                        if "credits" in details and "crew" in details["credits"]:
                            directors = []
                            for crew_member in details["credits"]["crew"]:
                                if crew_member.get("job") == "Director":
                                    directors.append({
                                        "id": crew_member["id"],
                                        "name": crew_member["name"],
                                        "profile_path": crew_member.get("profile_path"),
                                        "full_profile_path": f"{IMAGE_BASE_URL}{crew_member.get('profile_path')}" if crew_member.get("profile_path") else None
                                    })
                            movie_doc["directors"] = directors
                        
                        # Add reviews
                        if "reviews" in details and "results" in details["reviews"]:
                            reviews = []
                            for review in details["reviews"]["results"][:5]:  # Limit to 5 reviews
                                reviews.append({
                                    "id": review["id"],
                                    "author": review["author"],
                                    "content": review["content"],
                                    "created_at": review["created_at"],
                                    "url": review.get("url")
                                })
                            movie_doc["reviews"] = reviews
                        
                        # Add videos (trailers, teasers)
                        if "videos" in details and "results" in details["videos"]:
                            videos = []
                            for video in details["videos"]["results"]:
                                if video["site"] == "YouTube":  # Only include YouTube videos
                                    videos.append({
                                        "id": video["id"],
                                        "name": video["name"],
                                        "key": video["key"],
                                        "type": video["type"],
                                        "site": video["site"],
                                        "youtube_url": f"https://www.youtube.com/watch?v={video['key']}"
                                    })
                            movie_doc["videos"] = videos
                        
                        # Add full image URLs
                        if movie_doc.get("poster_path"):
                            movie_doc["full_poster_path"] = f"{IMAGE_BASE_URL}{movie_doc['poster_path']}"
                        if movie_doc.get("backdrop_path"):
                            movie_doc["full_backdrop_path"] = f"{IMAGE_BASE_URL}{movie_doc['backdrop_path']}"
                    
                    movie_docs.append(movie_doc)
                
                # Batch insertion of movies
                if movie_docs:
                    result = await mongo.movies_collection.insert_many(movie_docs)
                    total_imported += len(result.inserted_ids)
                    for i, inserted_id in enumerate(result.inserted_ids):
                        print(f"Imported movie: {movie_docs[i]['title']} with _id: {str(inserted_id)}")
                else:
                    print(f"No new movies to import on page {page}")
            
            except Exception as e:
                total_errors += 1
                print(f"Error importing movies on page {page}: {str(e)}")
        
        print(f"\nImport summary:")
        print(f"- Total movies imported: {total_imported}")
        print(f"- Movies already in database: {total_existing}")
        print(f"- Errors encountered: {total_errors}")
        
    finally:
        await mongo.close()


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Import movies from TMDB API to MongoDB")
    parser.add_argument("--pages", type=int, default=5, help="Number of pages to import (default: 5)")
    parser.add_argument("--category", type=str, default="popular", 
                        choices=["popular", "top_rated", "upcoming", "now_playing"],
                        help="Movie category to import (default: popular)")
    parser.add_argument("--clear", action="store_true", help="Clear existing movies before import")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    print(f"Starting import with: pages={args.pages}, category={args.category}, clear={args.clear}")
    asyncio.run(import_movies_to_db(args.pages, args.category, args.clear))

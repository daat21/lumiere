import os
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import asyncio

# Load .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# Get environment variables
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

# Ensure the environment variables are set
if not TMDB_API_KEY:
    raise ValueError("TMDB_API_KEY not found in the .env file.")
if not MONGO_URI:
    raise ValueError("MONGO_URI not found in the .env file.")

# Initialize the MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("movie_platform_db")
movies_collection = db.get_collection("movies")

# TMDB API base URL
TMDB_API_BASE_URL = "https://api.themoviedb.org/3"

async def fetch_movies_from_tmdb(page):
    """ Get movie data from TMDb API """
    url = f"{TMDB_API_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch data from TMDB: {response.status_code}")
        return response.json().get("results", [])

async def import_movies():
    """ Import movie data to MongoDB"""
    try:
        # Clear existing movie data
        await movies_collection.delete_many({})
        print("Cleared existing movies in MongoDB")

        # Get 5 pages of movie data (20 movies per page, 100 movies in total)
        for page in range(1, 6):
            movies = await fetch_movies_from_tmdb(page)
            print(f"Fetched page {page} with {len(movies)} movies")
            
            # Convert movie data and insert MongoDB
            for movie in movies:
                movie_data = {
                    "id": str(movie["id"]),
                    "title": movie["title"],
                    "genre": movie.get("genre_ids", []),
                    "overview": movie["overview"],
                    "release_date": int(movie["release_date"].split("-")[0]) if movie.get("release_date") else None,
                    "poster_path": movie["poster_path"],
                    "director": "Unknown",  # TMDb /movie/popular does not provide direct director information
                    "actors": [],
                    "average_rating": float(movie.get("vote_average", 0)),
                    "reviews": []
                }
                await movies_collection.insert_one(movie_data)
                print(f"Imported movie: {movie['title']}")
    except Exception as e:
        print(f"Error during movie import: {e}")
    finally:
        # Close the MongoDB connection
        client.close()
        print("MongoDB connection closed")

# Run asynchronous function
if __name__ == "__main__":
    asyncio.run(import_movies())
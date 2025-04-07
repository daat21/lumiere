import os
import asyncio
import httpx
from dotenv import load_dotenv
from app.models import Movie
import app.database

# ----------------- Configure the zone -----------------
# Load .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_API_BASE_URL = "https://api.themoviedb.org/3"
MOVIE_FETCH_PAGES = 5
# --------------------------------------------

# ----------------- function -------------------
# Pull TMDB single page popular movie data
async def fetch_movies_page(page:int):
    url = f"{TMDB_API_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json().get("results", [])
       
# Clear the existing movie data in MongoDB       
async def clear_existing_movies():
    if app.database.movies_collection is None:
        raise RuntimeError("movies_collection is None. Check if init_db() was called correctly.")
    await app.database.movies_collection.delete_many({})
    print("Cleared existing movies in MongoDB")

# Import a single movie to MongoDB
async def import_one_movie(movie):
    movie_doc = Movie(
        id=str(movie["id"]),
        title=movie["title"],
        genre=[str(gid) for gid in movie.get("genre_ids", [])],
        year=int(movie["release_date"].split("-")[0]) if movie.get("release_date") else None,
        average_rating=float(movie.get("vote_average", 0)),
        overview=movie.get("overview")
    ).model_dump(by_alias=True)
    movie_doc["_id"] = movie_doc["id"]

    try:
        await app.database.movies_collection.insert_one(movie_doc)
        print(f"Imported movie: {movie['title']}")
    except Exception as e:
        print(f"Failed to import {movie['title']}: {e}")


# Main import process
async def import_movies():
    await clear_existing_movies()

    for page in range(1, MOVIE_FETCH_PAGES + 1):
        try:
            movies = await fetch_movies_page(page)
            print(f"Fetched page {page} with {len(movies)} movies")
            for movie in movies:
                await import_one_movie(movie)
        except Exception as e:
            print(f"Failed to fetch/import page {page}: {e}") 
    print("Movie import completed successfully!")

# ----------------- Entrance --------------------

# Program entry
async def main():
    await app.database.init_db() 
    # Run the import
    await import_movies() 
    # Close database connection 
    await app.database.close_db()  

# Run asynchronous function
if __name__ == "__main__":
   asyncio.run(main())
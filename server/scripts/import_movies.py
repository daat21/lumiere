# pylint: disable=missing-docstring
import os
import asyncio
import httpx
from dotenv import load_dotenv
from server.models import Movie, Review
from server import database

# ----------------- Configure the zone -----------------
# Load .env file
load_dotenv(dotenv_path=os.path.join(
    os.path.dirname(__file__), "..", "..", ".env"))
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
MOVIE_FETCH_PAGES = 5
# --------------------------------------------

# ----------------- function -------------------


async def fetch_genres():
    url = f"{TMDB_BASE_URL}/genre/movie/list?api_key={TMDB_API_KEY}&language=en-US"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return {str(genre["id"]): genre["name"] for genre in response.json().get("genres", [])}
        return {}


async def fetch_movies_from_tmdb(page):
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page={page}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []


async def fetch_reviews(movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}/reviews?api_key={TMDB_API_KEY}&language=en-US"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            reviews = response.json().get("results", [])
            # Delay to avoid rate limiting
            await asyncio.sleep(0.1)
            return [
                Review(
                    author=review.get("author", "Unknown"),
                    content=review.get("content", ""),
                    rating=review.get("author_details", {}).get("rating")
                )
                # Limit to 3 reviews per movie
                for review in reviews[:3]
            ]
        return []


# Clear the existing movie data in MongoDB


async def clear_existing_movies():
    if database.mongo.movies_collection is None:
        raise RuntimeError(
            "movies_collection is None. Check if init_db() was called correctly.")
    await database.mongo.movies_collection.delete_many({})
    print("Cleared existing movies in MongoDB")

# Import a single movie to MongoDB


async def import_one_movie(movie):
    genres = await fetch_genres()
    reviews = await fetch_reviews(movie["id"])
    movie_data = Movie(
        id=str(movie["id"]),
        title=movie["title"],
        genre=[genres.get(str(gid), "Unknown")
               for gid in movie.get("genre_ids", [])],
        year=int(movie["release_date"].split("-")[0]
                 ) if movie.get("release_date") else None,
        average_rating=float(movie.get("vote_average", 0)),
        overview=movie.get("overview"),
        poster_path=movie.get("poster_path"),
        reviews=reviews
    ).model_dump(by_alias=True)
    await database.mongo.movies_collection.insert_one(movie_data)
    print(f"Imported movie: {movie['title']}")


# Main import process
async def import_movies():
    await database.mongo.connect()
    await clear_existing_movies()
    for page in range(1, MOVIE_FETCH_PAGES + 1):
        movies = await fetch_movies_from_tmdb(page)
        print(f"Fetched page {page} with {len(movies)} movies")
        for movie in movies:
            await import_one_movie(movie)
    print("Movie import completed!")

# ----------------- Entrance --------------------

# Program entry


async def main():
    await database.mongo.connect()
    # Run the import
    await import_movies()
    # Close database connection
    await database.mongo.close()

# Run asynchronous function
if __name__ == "__main__":
    asyncio.run(main())

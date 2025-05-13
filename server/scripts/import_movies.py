#!/usr/bin/env python3
import asyncio
import os
import sys
from pathlib import Path

# Add src directory to Python path
src_path = str(Path(__file__).parent.parent / "src")
sys.path.append(src_path)

from config.settings import get_settings
from services import MovieService


async def import_movies(tmdb_ids: list[str]):
    """Import movies from TMDB API"""
    settings = get_settings()
    movie_service = MovieService()
    
    print(f"Starting import of {len(tmdb_ids)} movies...")
    
    for tmdb_id in tmdb_ids:
        try:
            print(f"Importing movie with TMDB ID: {tmdb_id}")
            movie = await movie_service.import_movie_from_tmdb(tmdb_id)
            if movie:
                print(f"Successfully imported: {movie['title']}")
            else:
                print(f"Failed to import movie with TMDB ID: {tmdb_id}")
        except Exception as e:
            print(f"Error importing movie {tmdb_id}: {str(e)}")
    
    print("Import completed!")

def main():
    # Example usage: python import_movies.py 550 551 552
    if len(sys.argv) < 2:
        print("Usage: python import_movies.py <tmdb_id1> <tmdb_id2> ...")
        sys.exit(1)
    
    tmdb_ids = sys.argv[1:]
    asyncio.run(import_movies(tmdb_ids))

if __name__ == "__main__":
    main()

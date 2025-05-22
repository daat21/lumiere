import asyncio
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional
import httpx
from pydantic import BaseModel, Field
from src.config import settings
from src.models.tmdb_movie import (TMDBMovieCreditsResponse,
                                   TMDBMovieDetailResponse, TMDBMovieResponse,
                                   TMDBMovieVideosResponse, TMDBReview)

logger = logging.getLogger(__name__)


class TMDBRateLimiter:
    """TMDB API rate limiter"""

    def __init__(self, requests_per_second: float = 0.5):
        self.rate = requests_per_second
        self.last_request_time = datetime.now()
        self._lock = None
        self._semaphore = None

    async def acquire(self):
        """Acquire request permission"""
        # Create semaphore if it doesn't exist
        if self._semaphore is None:
            self._semaphore = asyncio.Semaphore(1)

        async with self._semaphore:
            now = datetime.now()
            time_since_last_request = (
                now - self.last_request_time).total_seconds()
            if time_since_last_request < 1.0 / self.rate:
                await asyncio.sleep(1.0 / self.rate - time_since_last_request)
            self.last_request_time = datetime.now()


class TMDBService:
    """Service for TMDB API operations"""

    def __init__(self):
        self.base_url = "https://api.themoviedb.org/3"
        self.api_key = settings.TMDB_API_KEY
        self.access_token = settings.TMDB_ACCESS_TOKEN
        self.rate_limiter = TMDBRateLimiter()
        self.timeout = httpx.Timeout(10.0, connect=5.0)
        self.max_retries = 3
        self.retry_delay = 1.0  # seconds
        self._genre_cache = None

        # Give priority to using the Bearer Token. If not available, use the API Key
        if self.access_token:
            self.headers = {
                "Authorization": f"Bearer {self.access_token}",
                "accept": "application/json"
            }
            self.params = {}
        else:
            self.headers = {"accept": "application/json"}
            self.params = {"api_key": self.api_key}

    async def _get_genre_map(self) -> Dict[int, str]:
        """Get genre ID to name mapping"""
        if self._genre_cache is None:
            genres = await self.get_genres()
            self._genre_cache = {genre["id"]: genre["name"]
                                 for genre in genres}
        return self._genre_cache

    async def _convert_genre_ids_to_names(self, genre_ids: List[int]) -> List[Dict[str, Any]]:
        """Convert genre IDs to genre dictionaries with id and name"""
        genre_map = await self._get_genre_map()
        return [{"id": genre_id, "name": genre_map.get(genre_id, "Unknown")} for genre_id in genre_ids]

    async def _make_request(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        retry_count: int = 0
    ) -> Dict[str, Any]:
        """Make a request to TMDB API"""
        try:
            # Wait for rate limit
            await self.rate_limiter.acquire()

            # Merge request parameters
            request_params = {**self.params, **(params or {})}

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}{endpoint}",
                    headers=self.headers,
                    params=request_params
                )

                # Check for error responses
                if response.status_code >= 400:
                    error_data = response.json()
                    error_message = error_data.get(
                        "status_message", "Unknown error")

                    # Handle specific error cases
                    if response.status_code == 404:
                        logger.error(f"Movie not found: {endpoint}")
                        raise httpx.HTTPStatusError(
                            f"HTTP 404: Movie not found - {error_message}",
                            request=response.request,
                            response=response
                        )
                    elif response.status_code == 401:
                        logger.error(f"Unauthorized access: {endpoint}")
                        raise httpx.HTTPStatusError(
                            f"HTTP 401: Unauthorized access - {error_message}",
                            request=response.request,
                            response=response
                        )
                    elif response.status_code == 429:
                        logger.warning(f"Rate limit exceeded: {endpoint}")
                        if retry_count < self.max_retries:
                            retry_after = int(response.headers.get(
                                "Retry-After", self.retry_delay))
                            await asyncio.sleep(retry_after)
                            return await self._make_request(endpoint, params, retry_count + 1)
                        raise httpx.HTTPStatusError(
                            f"HTTP 429: Too Many Requests - Rate limit exceeded after {self.max_retries} retries",
                            request=response.request,
                            response=response
                        )
                    else:
                        raise httpx.HTTPStatusError(
                            f"HTTP {response.status_code}: {error_message}",
                            request=response.request,
                            response=response
                        )

                return response.json()

        except httpx.TimeoutException as e:
            logger.error(f"Request timeout for {endpoint}: {str(e)}")
            if retry_count < self.max_retries:
                await asyncio.sleep(self.retry_delay * (retry_count + 1))
                return await self._make_request(endpoint, params, retry_count + 1)
            raise

        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error for {endpoint}: {str(e)}")
            if e.response.status_code == 429 and retry_count < self.max_retries:
                retry_after = int(e.response.headers.get(
                    "Retry-After", self.retry_delay))
                await asyncio.sleep(retry_after)
                return await self._make_request(endpoint, params, retry_count + 1)
            raise

        except Exception as e:
            logger.error(f"Unexpected error for {endpoint}: {str(e)}")
            if retry_count < self.max_retries:
                await asyncio.sleep(self.retry_delay * (retry_count + 1))
                return await self._make_request(endpoint, params, retry_count + 1)
            raise

    async def _make_request_with_retry(self, endpoint: str, params: Optional[Dict[str, Any]] = None, max_retries: int = 3) -> Dict[str, Any]:
        """Make a request to TMDB API with retry mechanism"""
        for attempt in range(max_retries):
            try:
                return await self._make_request(endpoint, params)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(1 * (attempt + 1))  # Exponential backoff

    async def get_movie(self, tmdb_id: str) -> TMDBMovieResponse:
        """Get basic movie information from TMDB"""
        try:
            # Get basic movie details
            data = await self._make_request(f"/movie/{tmdb_id}")
            # Convert id to string
            data["id"] = str(data["id"])

            # Convert genre_ids to genre names
            genre_ids = data.get("genre_ids", [])
            data["genres"] = await self._convert_genre_ids_to_names(genre_ids)

            return TMDBMovieResponse(**data)
        except Exception as e:
            logger.error(f"Error getting movie {tmdb_id}: {str(e)}")
            raise

    async def get_movie_reviews(self, tmdb_id: str, page: int = 1, limit: int = 3) -> tuple[List[TMDBReview], int]:
        """Get movie reviews from TMDB with pagination"""
        try:
            data = await self._make_request(f"/movie/{tmdb_id}/reviews", {
                "page": page,
                "limit": limit
            })
            reviews = [TMDBReview(**review)
                       for review in data.get("results", [])]
            total_reviews = data.get("total_results", 0)
            return reviews, total_reviews
        except Exception as e:
            logger.error(
                f"Error getting reviews for movie {tmdb_id}: {str(e)}")
            raise

    async def get_movie_with_reviews(self, movie_id: str) -> TMDBMovieDetailResponse:
        """Get movie details and reviews from TMDB"""
        try:
            # Get movie details
            movie = await self.get_movie(movie_id)
            # Get reviews
            reviews, total_reviews = await self.get_movie_reviews(movie_id)
            # Merge reviews to movie details
            movie.reviews = reviews
            movie.total_reviews = total_reviews
            return movie
        except Exception as e:
            logger.error(
                f"Error getting movie with reviews {movie_id}: {str(e)}")
            raise

    async def search_movies(
        self,
        query: str,
        page: int = 1,
        language: str = "en-US",
        include_adult: bool = False,
        year: Optional[int] = None,
        primary_release_year: Optional[int] = None,
        region: Optional[str] = None,
        with_genres: Optional[List[int]] = None,
        sort_by: Optional[str] = None
    ) -> List[TMDBMovieResponse]:
        """Search movies on TMDB with basic information

        Args:
            query (str): Search query
            page (int, optional): Page number. Defaults to 1.
            language (str, optional): Language code. Defaults to "en-US".
            include_adult (bool, optional): Include adult content. Defaults to False.
            year (Optional[int], optional): Release year. Defaults to None.
            primary_release_year (Optional[int], optional): Primary release year. Defaults to None.
            region (Optional[str], optional): Region code. Defaults to None.
            with_genres (Optional[List[int]], optional): Genre IDs. Defaults to None.
            sort_by (Optional[str], optional): Sort by field. Defaults to None.
                Options: popularity.desc, release_date.desc, vote_average.desc, etc.
        """
        try:
            logger.info(f"Searching movies with query: {query}, page: {page}")

            # Prepare search parameters
            search_params = {
                "query": query,
                "page": page,
                "language": language,
                "include_adult": include_adult
            }

            # Add optional parameters if provided
            if year is not None:
                search_params["year"] = year
            if primary_release_year is not None:
                search_params["primary_release_year"] = primary_release_year
            if region is not None:
                search_params["region"] = region
            if with_genres is not None:
                search_params["with_genres"] = ",".join(map(str, with_genres))
            if sort_by is not None:
                search_params["sort_by"] = sort_by

            # Conduct a movie search
            search_data = await self._make_request("/search/movie", search_params)

            # Log search results
            total_results = search_data.get("total_results", 0)
            logger.info(f"Found {total_results} results for query: {query}")

            if total_results == 0:
                logger.warning(f"No results found for query: {query}")
                return []

            movies = []
            for movie_data in search_data.get("results", []):
                # Convert id to string
                movie_data["id"] = str(movie_data["id"])
                # Convert genre_ids to genre names
                genre_ids = movie_data.get("genre_ids", [])
                movie_data["genres"] = await self._convert_genre_ids_to_names(genre_ids)

                movies.append(TMDBMovieResponse(**movie_data))
                logger.info(f"Added movie: {movie_data.get('title')}")

            logger.info(f"Returning {len(movies)} movies for query: {query}")
            return movies

        except Exception as e:
            logger.error(
                f"Error searching movies with query '{query}': {str(e)}")
            raise

    async def get_popular_movies(self, page: int = 1) -> List[TMDBMovieResponse]:
        """Get popular movies from TMDB with basic information"""
        try:
            data = await self._make_request("/movie/popular", {"page": page})
            movies = []
            for movie_data in data.get("results", []):
                # Convert id to string
                movie_data["id"] = str(movie_data["id"])
                # Convert genre_ids to genre names
                genre_ids = movie_data.get("genre_ids", [])
                movie_data["genres"] = await self._convert_genre_ids_to_names(genre_ids)

                movies.append(TMDBMovieResponse(**movie_data))
            return movies
        except Exception as e:
            logger.error(f"Error getting popular movies: {str(e)}")
            raise

    async def get_top_rated_movies(self, page: int = 1) -> List[TMDBMovieResponse]:
        """Get top rated movies from TMDB with basic information"""
        try:
            data = await self._make_request("/movie/top_rated", {"page": page})
            movies = []
            for movie_data in data.get("results", []):
                # Convert id to string
                movie_data["id"] = str(movie_data["id"])
                # Convert genre_ids to genre names
                genre_ids = movie_data.get("genre_ids", [])
                movie_data["genres"] = await self._convert_genre_ids_to_names(genre_ids)
                movies.append(TMDBMovieResponse(**movie_data))
            return movies
        except Exception as e:
            logger.error(f"Error getting top rated movies: {str(e)}")
            raise

    async def get_latest_movies(self, page: int = 1) -> List[TMDBMovieResponse]:
        """Get latest movies from TMDB with basic information"""
        try:
            data = await self._make_request("/movie/now_playing", {"page": page})
            movies = []
            for movie_data in data.get("results", []):
                # Convert id to string
                movie_data["id"] = str(movie_data["id"])
                # Convert genre_ids to genre names
                genre_ids = movie_data.get("genre_ids", [])
                movie_data["genres"] = await self._convert_genre_ids_to_names(genre_ids)
                movies.append(TMDBMovieResponse(**movie_data))
            return movies
        except Exception as e:
            logger.error(f"Error getting latest movies: {str(e)}")
            raise

    async def get_movies_by_genre(self, genre_id: int, page: int = 1) -> List[TMDBMovieResponse]:
        """Get movies by genre from TMDB with basic information"""
        try:
            data = await self._make_request("/discover/movie", {
                "with_genres": genre_id,
                "page": page
            })
            movies = []
            for movie_data in data.get("results", []):
                # Convert id to string
                movie_data["id"] = str(movie_data["id"])
                # Convert genre_ids to genre names
                genre_ids = movie_data.get("genre_ids", [])
                movie_data["genres"] = await self._convert_genre_ids_to_names(genre_ids)
                movies.append(TMDBMovieResponse(**movie_data))
            return movies
        except Exception as e:
            logger.error(f"Error getting movies by genre {genre_id}: {str(e)}")
            raise

    async def get_genres(self) -> List[Dict[str, Any]]:
        """Get all movie genres from TMDB"""
        try:
            response = await self._make_request("/genre/movie/list")
            return response.get("genres", [])
        except Exception as e:
            logger.error(f"Error getting genres: {str(e)}")
            raise

    async def get_movie_credits(self, tmdb_id: str) -> TMDBMovieCreditsResponse:
        """Get movie credits (cast and crew) from TMDB"""
        try:
            data = await self._make_request(f"/movie/{tmdb_id}/credits")
            return TMDBMovieCreditsResponse(**data)
        except Exception as e:
            logger.error(
                f"Error getting credits for movie {tmdb_id}: {str(e)}")
            raise

    async def get_movie_videos(self, tmdb_id: str) -> TMDBMovieVideosResponse:
        """Get movie videos (trailers, teasers, etc.) from TMDB"""
        try:
            data = await self._make_request(f"/movie/{tmdb_id}/videos")

            # Process each video to add youtube_url
            for video in data.get("results", []):
                if video.get("site") == "YouTube":
                    video["youtube_url"] = f"https://www.youtube.com/watch?v={video['key']}"
                else:
                    video["youtube_url"] = ""

            return TMDBMovieVideosResponse(**data)
        except Exception as e:
            logger.error(f"Error getting videos for movie {tmdb_id}: {str(e)}")
            raise

    async def get_movie_with_details(self, movie_id: str) -> TMDBMovieDetailResponse:
        """Get movie with all details (reviews, credits, videos) from TMDB"""
        try:
            # Get basic movie details
            data = await self._make_request(f"/movie/{movie_id}")
            # Convert id to string
            data["id"] = str(data["id"])

            # Convert genre_ids to genre names
            genre_ids = data.get("genre_ids", [])
            data["genres"] = await self._convert_genre_ids_to_names(genre_ids)

            # Create base movie object
            movie = TMDBMovieDetailResponse(**data)

            # Get additional details
            reviews, total_reviews = await self.get_movie_reviews(movie_id)
            credits = await self.get_movie_credits(movie_id)
            videos = await self.get_movie_videos(movie_id)

            # Merge all data
            movie.reviews = reviews
            movie.total_reviews = total_reviews
            movie.credits = credits
            movie.videos = videos

            return movie
        except Exception as e:
            logger.error(
                f"Error getting movie with all details {movie_id}: {str(e)}")
            raise

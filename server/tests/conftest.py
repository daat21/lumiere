import os
from unittest.mock import patch

import pytest


@pytest.fixture(autouse=True)
def setup_test_env():
    """Set up test environment variables"""
    test_env = {
        "TMDB_API_KEY": "test_api_key",
        "TMDB_ACCESS_TOKEN": "test_access_token",
        "TMDB_API_BASE_URL": "https://api.themoviedb.org/3",
        "MONGODB_DB": "test_movie_review_db",
        "MONGO_URL": "mongodb://localhost:27017"
    }
    
    with patch.dict(os.environ, test_env):
        yield

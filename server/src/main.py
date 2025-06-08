import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import auth, movies, reviews, users, watchlists
from src.database.connection import mongo
from src.database.repositories.movie import MovieRepository
from src.database.repositories.review import ReviewRepository
from src.database.repositories.user import UserRepository
from src.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        logger.info("Starting application")
        # Initialize database connection
        await mongo.connect()
        logger.info("Database connected successfully")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise
    
    yield
    
    # Shutdown
    try:
        logger.info("Shutting down application")
        # Close database connection
        await mongo.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

app = FastAPI(
    title="Movie API",
    description="A RESTful API for movie information and user interactions",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(movies.router, prefix="/movies")
app.include_router(reviews.router, prefix="/reviews")
app.include_router(watchlists.router, prefix="/watchlists")
@app.get("/")
async def root():
    return {"message": "Welcome to the Movie API",
            "version": "1.0.0",
            "docs_url": "/docs"
            }

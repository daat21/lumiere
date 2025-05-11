import asyncio
import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient

from src.config import settings

logger = logging.getLogger(__name__)


class MongoDB:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.users = None
        self.movies = None
        self.reviews = None
        self._is_connected = False
        self._max_retries = 3
        self._retry_delay = 1  # seconds
        self._initialized = False

    async def connect(self):
        """Connect to MongoDB with retry mechanism"""
        if self._is_connected:
            return

        for attempt in range(self._max_retries):
            try:
                self.client = AsyncIOMotorClient(
                    settings.MONGO_URL,
                    maxPoolSize=50,
                    minPoolSize=10,
                    maxIdleTimeMS=30000,
                    waitQueueTimeoutMS=2500,
                    connectTimeoutMS=2000,
                    serverSelectionTimeoutMS=2000
                )
                self.db = self.client[settings.MONGODB_DB]

                # Initialize collections
                self.users = self.db["users"]
                self.movies = self.db["movies"]
                self.reviews = self.db["reviews"]

                # Verify connection
                await self.client.admin.command('ping')
                self._is_connected = True
                self._initialized = True
                logger.info(f"Connected to MongoDB - Database: {self.db.name}")
                return

            except Exception as e:
                if attempt == self._max_retries - 1:
                    self._is_connected = False
                    logger.error(
                        f"Failed to connect to MongoDB after {self._max_retries} attempts: {str(e)}")
                    raise
                logger.warning(
                    f"Connection attempt {attempt + 1} failed: {str(e)}")
                await asyncio.sleep(self._retry_delay)

    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            try:
                self.client.close()
                self._is_connected = False
                self._initialized = False
                logger.info("Closed MongoDB connection")
            except Exception as e:
                logger.error(f"Error closing MongoDB connection: {str(e)}")
                raise

    def _ensure_connected(self):
        """Ensure database is connected and connection is valid"""
        if not self._initialized:
            raise RuntimeError(
                "Database not initialized. Make sure FastAPI's lifespan event is properly configured.")
        if not self._is_connected:
            raise RuntimeError("Database not connected. Call connect() first.")
        try:
            self.client.admin.command('ping')
        except Exception as e:
            logger.error(f"Database connection error: {str(e)}")
            self._is_connected = False
            raise RuntimeError("Database connection lost. Please reconnect.")

    @property
    def is_connected(self) -> bool:
        """Check if database is connected"""
        return self._is_connected

    @property
    def is_initialized(self) -> bool:
        """Check if database is initialized"""
        return self._initialized


mongo = MongoDB()


# from motor.motor_asyncio import AsyncIOMotorClient
# from src.config.settings import get_settings
# import logging
# from typing import Optional
# import asyncio

# settings = get_settings()
# # logger = logging.getLogger(__name__)

# class MongoDB:
#     def __init__(self):
#         self.client: Optional[AsyncIOMotorClient] = None
#         self._max_retries = 3
#         self._retry_delay = 1  # seconds

#     async def connect(self):
#         """Connect to MongoDB with retry mechanism"""
#         for attempt in range(self._max_retries):
#             try:
#                 self.client = AsyncIOMotorClient(
#                     settings.MONGO_URL,
#                     maxPoolSize=50,
#                     minPoolSize=10,
#                     maxIdleTimeMS=30000,
#                     waitQueueTimeoutMS=2500,
#                     connectTimeoutMS=2000,
#                     serverSelectionTimeoutMS=2000
#                 )
#                 # Verify connection
#                 await self.client.admin.command('ping')
#                 logger.info("Connected to MongoDB")
#                 return

#             except Exception as e:
#                 if attempt == self._max_retries - 1:
#                     logger.error(f"Failed to connect to MongoDB after {self._max_retries} attempts: {str(e)}")
#                     raise
#                 logger.warning(f"Connection attempt {attempt + 1} failed: {str(e)}")
#                 await asyncio.sleep(self._retry_delay)

#     async def close(self):
#         """Close MongoDB connection"""
#         if self.client:
#             try:
#                 self.client.close()
#                 logger.info("Closed MongoDB connection")
#             except Exception as e:
#                 logger.error(f"Error closing MongoDB connection: {str(e)}")

#     def _ensure_connected(self):
#         """Ensure database is connected and connection is valid"""
#         if not self.client:
#             raise RuntimeError("Database not connected. Call connect() first.")
#         try:
#             self.client.admin.command('ping')
#         except Exception as e:
#             logger.error(f"Database connection error: {str(e)}")
#             self.connect()

#     @property
#     def user_db(self):
#         """Get user database"""
#         self._ensure_connected()
#         return self.client["user_db"]

#     @property
#     def movie_db(self):
#         """Get movie database"""
#         self._ensure_connected()
#         return self.client["movie_db"]

#     @property
#     def users(self):
#         """Get users collection"""
#         self._ensure_connected()
#         return self.user_db["users"]

#     @property
#     def movies(self):
#         """Get movies collection"""
#         self._ensure_connected()
#         return self.movie_db["movies"]

#     @property
#     def reviews(self):
#         """Get reviews collection"""
#         self._ensure_connected()
#         return self.movie_db["reviews"]

# mongo = MongoDB()

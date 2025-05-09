# pylint: disable=missing-docstring
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")


class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        self.movies_collection = None

    async def connect(self):
        if not MONGO_URI:
            raise ValueError("MONGO_URI is not set. Check your .env file.")
        self.client = AsyncIOMotorClient(MONGO_URI)
        self.db = self.client.get_database("movie_platform_db")
        self.movies_collection = self.db.get_collection("movies")
        print("Connected to MongoDB Atlas")

    async def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB Atlas connection")


mongo = MongoDB()

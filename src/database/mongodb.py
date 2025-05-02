from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/movies_db")


class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        self.users_collection = None
        self.movies_collection = None
        self.reviews_collection = None

    async def connect(self):
        self.client = AsyncIOMotorClient(MONGO_URI)
        self.db = self.client["movies_db"]
        self.users_collection = self.db["users"]
        self.movies_collection = self.db["movies"]
        self.reviews_collection = self.db["reviews"]
        print("Connected to MongoDB")
        print(
            f"Connected to MongoDB - Database: {self.db.name}, Movies Collection: {self.movies_collection.name}")

    async def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")


mongo = MongoDB()

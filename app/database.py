from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
print(f"MONGO_URI: {MONGO_URI}")
print(f"app.database module ID: {id(__name__)}")  # Debug: Print module ID

client = None
db = None
movies_collection = None

async def init_db():
    global client, db, movies_collection
    if not MONGO_URI:
        raise ValueError("MONGO_URI is not set. Check your .env file.")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.get_database("movie_platform_db")
    movies_collection = db.get_collection("movies")
    print(f"movies_collection initialized: {movies_collection is not None}")
    print("Connected to MongoDB Atlas")

async def close_db():
    global client
    if client:
        client.close()
        print("Closed MongoDB Atlas connection")
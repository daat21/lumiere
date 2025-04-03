from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Creating a MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("movie_platform_db")
movies_collection = db.get_collection("movies")

# Close the connection (called when the application is closed)
def close_mongo_connection():
    client.close()
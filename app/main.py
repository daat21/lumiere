from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from database import movies_collection, close_mongo_connection
from models import Movie
from typing import List, Union
from fastapi import Uvicorn

# Define Lifespan event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run at startup
    print("Connecting to MongoDB")
    yield
    # Code to run at shutdown
    close_mongo_connection()
    print("Disconnected from MongoDB")

# Create a FastAPI application and pass lifespan
app = FastAPI(lifespan=lifespan)

# Test endpoint: Get all movies
@app.get("/movies", response_model=List[Movie])
async def get_all_movies():
    movies = await movies_collection.find().to_list(length=10)
    return movies
    
#async def startup_event():
    # Initialize the database connection
#    await movies_collection.database.client.start_session()

# Root path
@app.get("/")
async def root():
    return {"Message": "Hello World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}
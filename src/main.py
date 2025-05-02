from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import movies, reviews, auth
from src.database.mongodb import mongo

app = FastAPI(title="Movie Platform API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
async def connect_to_mongo():
    await mongo.connect()
# Close MongoDB connection
async def close_mongo_connection():
    await mongo.close()


# Database events
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Include routers
app.include_router(auth.router, prefix="/users")
app.include_router(movies.router, prefix="")
app.include_router(reviews.router, prefix="")


@app.get("/")
async def root():
    return {"message": "Welcome to the Movie Platform API"}

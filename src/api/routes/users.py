from fastapi import APIRouter, HTTPException
from src.models.user import UserCreate, UserLogin
from src.database.mongodb import mongo
from passlib.context import CryptContext

router = APIRouter(prefix="/users", tags=["users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
async def register_user(user: UserCreate):
    existing_user = await mongo.users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    user_dict["id"] = ""
    user_dict["disabled"] = False
    await mongo.users_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}


@router.post("/login")
async def login_user(user: UserLogin):
    db_user = await mongo.users_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(
            status_code=401, detail="Incorrect username or password")
    return {"access_token": "fake-jwt-token", "token_type": "bearer"}

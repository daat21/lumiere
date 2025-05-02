from bson import ObjectId
from src.database.mongodb import mongo
from src.models.user import User, UserCreate
from fastapi import HTTPException
import bcrypt
from typing import Optional


class UserService:
    async def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user.
        """
        # Check if user with the same email already exists
        existing_user = await mongo.users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password
        hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user_dict = {
            "email": user_data.email,
            "hashed_password": hashed_password.decode('utf-8'),
            "username": user_data.username,
            "is_active": True
        }
        
        # Insert into database
        result = await mongo.users_collection.insert_one(user_dict)
        
        # Return created user (without password)
        return User(
            id=str(result.inserted_id),
            email=user_data.email,
            username=user_data.username,
            is_active=True
        )
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """
        Get a user by email.
        """
        user = await mongo.users_collection.find_one({"email": email})
        return user
    
    async def get_user_by_id(self, user_id: str) -> User:
        """
        Get a user by ID.
        """
        try:
            user = await mongo.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
            
            return User(
                id=str(user["_id"]),
                email=user["email"],
                username=user["username"],
                is_active=user["is_active"]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid user ID format: {str(e)}")
    
    async def update_user(self, user_id: str, user_data: dict) -> User:
        """
        Update a user.
        """
        try:
            # Get the user
            user = await mongo.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
            
            # Update the user
            await mongo.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": user_data}
            )
            
            # Get the updated user
            updated_user = await mongo.users_collection.find_one({"_id": ObjectId(user_id)})
            
            return User(
                id=str(updated_user["_id"]),
                email=updated_user["email"],
                username=updated_user["username"],
                is_active=updated_user["is_active"]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid user ID format: {str(e)}")
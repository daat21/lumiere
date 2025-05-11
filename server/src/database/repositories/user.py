from datetime import datetime
from typing import Any, Dict, List, Optional

import bcrypt

from src.database.connection import mongo
from src.database.repositories.base import BaseRepository
from src.models.user import User, UserCreate, UserUpdate


class UserRepository(BaseRepository[User]):
    """User repository with user-specific database operations"""

    def __init__(self):
        super().__init__(mongo.db, "users")

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        return await self.find_one({"email": email})

    async def get_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username"""
        return await self.find_one({"username": username})

    async def create_user(self, user_data: UserCreate) -> str:
        """Create a new user"""
        user_dict = user_data.model_dump(exclude={"confirm_password"})
        return await self.create(user_dict)

    async def update_user(self, user_id: str, user_data: UserUpdate) -> bool:
        """Update user information"""
        update_data = user_data.model_dump(exclude_unset=True)
        if "new_password" in update_data:
            update_data["hashed_password"] = update_data.pop("new_password")
        return await self.update(user_id, update_data)

    async def update_last_login(self, user_id: str) -> bool:
        """Update user's last login timestamp"""
        return await self.update(user_id, {"last_login": datetime.now()})

    async def find_many(self, query: Dict[str, Any], skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Find multiple users matching the query with pagination.

        Args:
            query: MongoDB query dictionary
            skip: Number of documents to skip
            limit: Maximum number of documents to return

        Returns:
            List of user documents
        """
        try:
            cursor = self.collection.find(query).skip(skip).limit(limit)
            return await cursor.to_list(length=limit)
        except Exception as e:
            raise Exception(f"Error finding users: {str(e)}")

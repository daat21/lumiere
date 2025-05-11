import re
from datetime import datetime
from typing import List, Optional

import bcrypt
from bson import ObjectId
from fastapi import HTTPException, status

from src.database.connection import mongo
from src.database.repositories.user import UserRepository
from src.models import User, UserCreate, UserUpdate
from src.utils.exceptions import (ResourceNotFoundError, UnauthorizedError,
                                  ValidationError)


class UserService:
    def __init__(self, user_repository: Optional[UserRepository] = None):
        self.user_repository = user_repository or UserRepository()

    async def create_user(self, user_data: UserCreate) -> User:
        print("[DEBUG] creating user:", user_data)
        """
        Create a new user.
        """
        # Check if user with the same email already exists
        existing_user = await self.user_repository.get_by_email(user_data.email)
        if existing_user:
            raise ValidationError("Email already registered")

        # Check if username is taken
        existing_username = await self.user_repository.get_by_username(user_data.username)
        if existing_username:
            raise ValidationError("Username already taken")

        # Hash the password
        hashed_password = bcrypt.hashpw(
            user_data.password.encode('utf-8'), bcrypt.gensalt())

        # Create user document
        now = datetime.now()
        user_dict = {
            "email": user_data.email,
            "hashed_password": hashed_password.decode('utf-8'),
            "username": user_data.username,
            "is_active": True,
            "is_superuser": False,
            "created_at": now,
            "updated_at": now,
            "last_login": None,
            "avatar_url": None,
            "bio": None,
            "preferences": {}
        }

        # Insert into database
        user_id = await self.user_repository.create(user_dict)

        # Return created user
        return await self.get_user_by_id(user_id)

    async def create_admin_user(self, user_data: UserCreate) -> User:
        """
        Create a new admin user.

        Args:
            user_data: User creation data

        Returns:
            Created admin user

        Raises:
            ValidationError: If email or username is already taken
        """
        # Check if user with the same email already exists
        existing_user = await self.user_repository.get_by_email(user_data.email)
        if existing_user:
            raise ValidationError("Email already registered")

        # Check if username is taken
        existing_username = await self.user_repository.get_by_username(user_data.username)
        if existing_username:
            raise ValidationError("Username already taken")

        # Hash the password
        hashed_password = bcrypt.hashpw(
            user_data.password.encode('utf-8'), bcrypt.gensalt())

        # Create user document with admin privileges
        now = datetime.now()
        user_dict = {
            "email": user_data.email,
            "hashed_password": hashed_password.decode('utf-8'),
            "username": user_data.username,
            "is_active": True,
            "is_superuser": True,  # Set as admin
            "created_at": now,
            "updated_at": now,
            "last_login": None,
            "avatar_url": None,
            "bio": None,
            "preferences": {}
        }

        # Insert into database
        user_id = await self.user_repository.create(user_dict)

        # Return created user
        return await self.get_user_by_id(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email.

        Args:
            email: User's email

        Returns:
            User object if found, None otherwise
        """
        user = await self.user_repository.get_by_email(email)
        if user:
            # Convert the _id of MongoDB to the string id
            user["id"] = str(user["_id"])
            return User(**user)
        return None

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Get a user by username.

        Args:
            username: User's username

        Returns:
            User object if found, None otherwise
        """
        user = await self.user_repository.get_by_username(username)
        if user:
            # Convert the _id of MongoDB to the string id
            user["id"] = str(user["_id"])
            # Ensure hashed_password is included
            if "hashed_password" not in user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="User data is incomplete"
                )
            return User(**user)
        return None

    async def get_user_by_id(self, user_id: str) -> User:
        """
        Get a user by ID.

        Args:
            user_id: User's ID

        Returns:
            User object

        Raises:
            HTTPException: If user not found or ID is invalid
        """
        try:
            user = await self.user_repository.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )
            # Convert the _id of MongoDB to the string id
            user["id"] = str(user["_id"])
            return User(**user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid user ID format: {str(e)}"
            )

    async def update_user(self, user_id: str, user_data: UserUpdate, current_user: User) -> User:
        """
        Update a user.

        Args:
            user_id: User's ID
            user_data: Update data
            current_user: Current authenticated user

        Returns:
            Updated user object

        Raises:
            HTTPException: If user not found, unauthorized, or validation fails
        """
        try:
            # Check if user exists
            user = await self.user_repository.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )

            # Check if user is authorized to update
            if str(user["_id"]) != current_user.id and not current_user.is_superuser:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to update this user"
                )

            # Prepare update data
            update_data = {}

            if user_data.email is not None:
                # Check if new email is already taken
                existing_user = await self.get_user_by_email(user_data.email)
                if existing_user and str(existing_user["_id"]) != user_id:
                    raise ValidationError("Email already registered")
                update_data["email"] = user_data.email

            if user_data.username is not None:
                # Check if new username is already taken
                existing_user = await self.get_user_by_username(user_data.username)
                if existing_user and str(existing_user["_id"]) != user_id:
                    raise ValidationError("Username already taken")
                update_data["username"] = user_data.username

            if user_data.new_password is not None:
                # Verify current password
                if not user_data.current_password:
                    raise ValidationError(
                        "Current password is required to set new password")

                if not bcrypt.checkpw(
                    user_data.current_password.encode('utf-8'),
                    user["hashed_password"].encode('utf-8')
                ):
                    raise ValidationError("Current password is incorrect")

                # Hash new password
                update_data["hashed_password"] = bcrypt.hashpw(
                    user_data.new_password.encode('utf-8'),
                    bcrypt.gensalt()
                ).decode('utf-8')

            if update_data:
                update_data["updated_at"] = datetime.now()
                await self.user_repository.update(user_id, update_data)

            return await self.get_user_by_id(user_id)

        except ValidationError:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error updating user: {str(e)}"
            )

    async def delete_user(self, user_id: str, current_user: User) -> bool:
        """
        Delete a user.

        Args:
            user_id: User's ID
            current_user: Current authenticated user

        Returns:
            True if user was deleted

        Raises:
            HTTPException: If user not found or unauthorized
        """
        try:
            # Check if user exists
            user = await self.user_repository.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {user_id} not found"
                )

            # Check if user is authorized to delete
            if str(user["_id"]) != current_user.id and not current_user.is_superuser:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to delete this user"
                )

            # Delete user
            return await self.user_repository.delete(user_id)

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error deleting user: {str(e)}"
            )

    async def update_last_login(self, user_id: str) -> None:
        """
        Update user's last login timestamp.

        Args:
            user_id: User's ID
        """
        try:
            await self.user_repository.update_last_login(user_id)
        except Exception:
            # Silently fail - this is not critical
            pass

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """
        List all users with pagination.

        Args:
            skip: Number of users to skip
            limit: Maximum number of users to return

        Returns:
            List of User objects
        """
        try:
            users = await self.user_repository.find_many({}, skip=skip, limit=limit)
            return [
                User(
                    id=str(user["_id"]),
                    email=user["email"],
                    username=user["username"],
                    is_active=user["is_active"],
                    is_superuser=user.get("is_superuser", False),
                    created_at=user.get("created_at"),
                    updated_at=user.get("updated_at"),
                    last_login=user.get("last_login"),
                    avatar_url=user.get("avatar_url"),
                    bio=user.get("bio"),
                    preferences=user.get("preferences", {})
                )
                for user in users
            ]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error listing users: {str(e)}"
            )

    async def get_all_users(self) -> List[User]:
        return await self.user_repository.get_all()

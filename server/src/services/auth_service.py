from datetime import datetime, timedelta
from typing import Optional, Tuple
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.config import auth_settings
from src.models.token import LoginResponse, Token, TokenRefresh
from src.models.user import User
from src.services.user_service import UserService

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


class AuthService:
    def __init__(self, user_service: UserService = None):
        self.user_service = user_service or UserService()

    async def login(self, username: str, password: str) -> LoginResponse:
        """Login user and return user information"""
        # Authenticate user
        user = await self.authenticate_user(username, password)
        
        # Update last login time
        await self.user_service.update_last_login(user.id)
        
        # Generate tokens
        access_token = self.create_access_token({"sub": user.id})
        refresh_token = self.create_refresh_token({"sub": user.id})
        
        return LoginResponse(
            user=user,
            access_token=access_token,
            refresh_token=refresh_token,
            message="Login successful!"
        )
        

    async def authenticate_user(self, username: str, password: str) -> User:
        """Authenticate a user and return user object if successful"""
        user = await self.user_service.get_user_by_username(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        if not self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        return user

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )

    def hash_password(self, password: str) -> str:
        """
        Hash a password.

        Args:
            password: Plain text password

        Returns:
            Hashed password
        """
        return bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt(rounds=auth_settings.BCRYPT_ROUNDS)
        ).decode('utf-8')

    def create_access_token(self, data: dict) -> str:
        """Create a new access token"""
        to_encode = data.copy()
        expire = datetime.now() + timedelta(minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, auth_settings.JWT_SECRET_KEY, algorithm=auth_settings.JWT_ALGORITHM)

    def create_refresh_token(self, data: dict) -> str:
        """Create a new refresh token"""
        to_encode = data.copy()
        expire = datetime.now() + timedelta(days=auth_settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, auth_settings.JWT_SECRET_KEY, algorithm=auth_settings.JWT_ALGORITHM)

    async def get_current_user(self, token: str) -> User:
        """Get current user from token"""
        try:
            payload = jwt.decode(token, auth_settings.JWT_SECRET_KEY, algorithms=[
                                 auth_settings.JWT_ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await self.user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user

    async def refresh_access_token(self, refresh_token: str) -> Tuple[str, str]:
        """Refresh access token using refresh token"""
        try:
            payload = jwt.decode(refresh_token, auth_settings.JWT_SECRET_KEY, algorithms=[
                                 auth_settings.JWT_ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        user = await self.user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        access_token = self.create_access_token({"sub": user.id})
        refresh_token = self.create_refresh_token({"sub": user.id})
        return access_token, refresh_token

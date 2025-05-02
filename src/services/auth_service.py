from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from src.services.user_service import UserService
import os

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

# Get JWT secret from environment variable
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthService:
    def __init__(self):
        self.user_service = UserService()
    
    async def authenticate_user(self, email: str, password: str):
        """
        Authenticate a user.
        """
        user = await self.user_service.get_user_by_email(email)
        if not user:
            return False
        
        if not self.verify_password(password, user["hashed_password"]):
            return False
        
        return user
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        """
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """
        Create a JWT token.
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return encoded_jwt
    
    async def get_current_user(self, token: str = Depends(oauth2_scheme)):
        """
        Get the current user from a JWT token.
        """
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await self.user_service.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
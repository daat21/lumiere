from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from src.services.auth_service import AuthService, ACCESS_TOKEN_EXPIRE_MINUTES
from src.services.user_service import UserService
from src.models.user import UserCreate, User
from src.models.token import Token

router = APIRouter(tags=["auth"])
auth_service = AuthService()
user_service = UserService()


@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """
    Register a new user.
    """
    return await user_service.create_user(user_data)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Get an access token.
    """
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth_service.get_current_user)):
    return current_user

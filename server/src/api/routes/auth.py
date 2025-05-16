from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from src.database.repositories.user import UserRepository
from src.models.token import LoginRequest, LoginResponse, Token, TokenRefresh
from src.models.user import User
from src.services.auth_service import AuthService
from src.services.user_service import UserService

router = APIRouter(tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_auth_service() -> AuthService:
    user_repository = UserRepository()
    user_service = UserService(user_repository)
    return AuthService(user_service)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    return await auth_service.get_current_user(token)

@router.post("/login", response_model=LoginResponse)
async def login(login_request: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    """Login user and return user information"""
    return await auth_service.login(login_request.username, login_request.password)

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    OAuth2 standard token endpoint for API authentication.
    Returns access token, refresh token and token type.
    """
    try:
        user = await auth_service.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = auth_service.create_access_token(data={"sub": user.id})
        refresh_token = auth_service.create_refresh_token(data={"sub": user.id})

        # Update last login time
        await auth_service.user_service.update_last_login(user.id)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Refresh access token using refresh token.
    """
    try:
        access_token, refresh_token = await auth_service.refresh_access_token(token_data.refresh_token)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information.
    """
    return current_user

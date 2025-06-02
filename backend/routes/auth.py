from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from models.database import get_db
from models.user import User
from utils.security import create_access_token, get_current_active_user
from config import settings

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={401: {"description": "Unauthorized"}},
)

# Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str = None
    phone_number: str = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str = None
    phone_number: str = None
    is_active: bool
    
    class Config:
        from_attributes = True

# Routes
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Try to authenticate with username
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # If not found, try with email
    if not user:
        user = db.query(User).filter(User.email == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    # Check if user with this email already exists
    user_by_email = db.query(User).filter(User.email == user_in.email).first()
    if user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if user with this username already exists
    user_by_username = db.query(User).filter(User.username == user_in.username).first()
    if user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user = User(
        email=user_in.email,
        username=user_in.username,
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        is_active=True
    )
    user.set_password(user_in.password)
    
    # Save user to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.get("/me", response_model=UserResponse)
async def get_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information
    """
    return current_user

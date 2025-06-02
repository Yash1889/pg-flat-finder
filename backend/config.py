import os
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Simple settings without dependency on pydantic-settings
class Settings:
    # Application settings
    APP_NAME = "PG Flat Finder"
    DEBUG = os.getenv("DEBUG", "False") == "True"
    API_V1_PREFIX = "/api/v1"
    
    # JWT Authentication
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM = "HS256"
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Database settings
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/pgflatfinder")
    
    # API Keys
    MAPBOX_API_KEY: Optional[str] = os.getenv("MAPBOX_API_KEY")
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

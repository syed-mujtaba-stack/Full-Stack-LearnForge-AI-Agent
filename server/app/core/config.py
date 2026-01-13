from pydantic_settings import BaseSettings
from typing import ClassVar, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduGenius AI"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://[::1]:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Database
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Auth
    SECRET_KEY: str = "your-secret-key-here" # Change in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Firebase credentials (optional, alternative to JSON file)
    FIREBASE_PROJECT_ID: str | None = None
    FIREBASE_PRIVATE_KEY: str | None = None
    FIREBASE_CLIENT_EMAIL: str | None = None
    FIREBASE_WEB_API_KEY: str | None = None
    
    # AI Providers
    GOOGLE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    # Vector DB
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = "us-east-1"
    PINECONE_INDEX_NAME: str = "edugenius-index"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

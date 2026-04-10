import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# NOTE: 載入 .env 檔案中的環境變數
load_dotenv()

class Settings(BaseSettings):
    """
    統一管理應用程式環境變數
    """
    supabaseUrl: str = os.getenv("SUPABASE_URL", "")
    supabaseKey: str = os.getenv("SUPABASE_KEY", "")
    jwtSecretKey: str = os.getenv("JWT_SECRET_KEY", "super_secret_key_for_development_only")
    jwtAlgorithm: str = "HS256"
    accessTokenExpireMinutes: int = 60 * 24 * 7  # 7 天

settings = Settings()

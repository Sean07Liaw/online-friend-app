from supabase import create_client, Client
from core.config import settings
import logging

def getSupabaseClient() -> Client:
    """
    初始化並返回 Supabase 客戶端。
    """
    url: str = settings.supabaseUrl
    key: str = settings.supabaseKey
    
    if not url or not key:
        # HACK: 若環境變數尚未設定，給予提示而不立即崩潰，以便能部分運行
        logging.warning("尚未配置 SUPABASE_URL 或 SUPABASE_KEY。請檢查 .env 檔案設定。")
    
    return create_client(url, key)

supabaseClient = getSupabaseClient()

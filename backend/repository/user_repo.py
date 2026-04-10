import logging
from typing import List, Optional, Dict, Any
from core.supabase import supabaseClient

def getUserByUsername(username: str) -> Optional[Dict[str, Any]]:
    """
    依據 username 查詢用戶，主要用於登入或註冊防重覆檢查
    """
    try:
        response = supabaseClient.table("users").select("*").eq("username", username).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        logging.error(f"Error fetching user by username: {e}")
        raise e

def getUserById(userId: str) -> Optional[Dict[str, Any]]:
    """
    依據 ID 查詢單一用戶資訊
    """
    try:
        response = supabaseClient.table("users").select("*").eq("id", userId).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        logging.error(f"Error fetching user by id: {e}")
        raise e

def createUser(username: str, passwordHash: str) -> Dict[str, Any]:
    """
    建立新用戶並將資料寫入 Supabase user table
    """
    try:
        # 預設一些假資料來豐富畫面效果
        defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDG7CW9-BbeZUn5Fe77TqQxgdOPERMut9WCH19rWixlck9QuW36uaipTDkO_fCmAq4P2iOogwXG6rrcHypqdOm2a8e2DOemEDWUQSKSKZIkBjLTr96CKLM_BgrqSHKOg4BmC3WP8FSJKYmMDbXkfdKGGgYvCiNP9bem1nWXUJaSILLcGXLzp45hb-AyetWGK8WdFSDvDiahRsWfDtIxX9mpKJiTTCL4aVxAgZd0kNwLNoyzDhgumUmYv5bRHb9rmecn88_xGkJ169Gq"
        defaultStatus = "New to the app!"

        response = supabaseClient.table("users").insert({
            "username": username,
            "password_hash": passwordHash,
            "avatar": defaultAvatar,
            "status": defaultStatus,
            "is_online": True
        }).execute()
        
        return response.data[0]
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        raise e

def getAllUsersExcept(userId: str) -> List[Dict[str, Any]]:
    """
    獲取所有除了自己以外的用戶，用作展示「好友清單」
    """
    try:
        response = supabaseClient.table("users").select("*").neq("id", userId).execute()
        return response.data
    except Exception as e:
        logging.error(f"Error fetching all users: {e}")
        raise e

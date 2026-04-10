from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
from schema.user import UserResponse
from service import user_service
from core import security
from fastapi import HTTPException, status

router = APIRouter()
oauth2Scheme = OAuth2PasswordBearer(tokenUrl="api/auth/signin")

def getCurrentUserId(token: str = Depends(oauth2Scheme)) -> str:
    """
    FastAPI 依賴項：確保請求帶有合法 Token，並解析出其中的 userId
    """
    payload = security.decodeAccessToken(token)
    userId: str = payload.get("sub")
    if userId is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的認證憑證",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return userId

@router.get("/me", response_model=UserResponse)
def readUsersMe(currentUserId: str = Depends(getCurrentUserId)):
    """
    取得目前授權使用者的資訊
    """
    return user_service.getCurrentUser(currentUserId)

@router.get("/friends", response_model=List[UserResponse])
def getFriendsList(currentUserId: str = Depends(getCurrentUserId)):
    """
    取得所有好友名單 (除了自己以外的所有系統註冊用戶)
    """
    return user_service.getAllFriends(currentUserId)

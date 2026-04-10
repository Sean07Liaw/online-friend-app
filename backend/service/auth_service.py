from fastapi import HTTPException, status
from repository import user_repo
from core import security
from schema.user import UserCreate, UserResponse

def registerUser(userData: UserCreate) -> UserResponse:
    """
    註冊新用戶的業務邏輯：檢查重覆 -> 加密密碼 -> 建立使用者
    """
    existingUser = user_repo.getUserByUsername(userData.username)
    if existingUser:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用戶名已存在"
        )
    
    hashedPwd = security.getPasswordHash(userData.password)
    newUser = user_repo.createUser(userData.username, hashedPwd)
    return UserResponse(**newUser)

def authenticateUser(userData: UserCreate) -> str:
    """
    登入驗證的業務邏輯：尋找用戶 -> 驗證密碼 -> 產生 Token
    """
    user = user_repo.getUserByUsername(userData.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的用戶名或密碼",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not security.verifyPassword(userData.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的用戶名或密碼",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 權限驗證通過，發放 Token
    tokenPayload = {"sub": user["id"]}
    token = security.createAccessToken(data=tokenPayload)
    return token

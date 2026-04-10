from fastapi import APIRouter
from schema.user import UserCreate, UserResponse
from schema.auth import Token
from service import auth_service

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(userData: UserCreate):
    """
    提供新用戶註冊
    """
    return auth_service.registerUser(userData)

@router.post("/signin", response_model=Token)
def signin(userData: UserCreate):
    """
    提供用戶登入，成功則回傳 JWT Token
    """
    accessToken = auth_service.authenticateUser(userData)
    return {"accessToken": accessToken, "tokenType": "bearer"}

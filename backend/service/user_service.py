from typing import List
from fastapi import HTTPException, status
from repository import user_repo
from schema.user import UserResponse

def getAllFriends(currentUserId: str) -> List[UserResponse]:
    """
    根據用戶要求，獲取所有登入的人並作為好友展示
    這裡只需排除自己即可
    """
    usersList = user_repo.getAllUsersExcept(currentUserId)
    # 將 dict 資料轉換回 Pydantic model
    return [UserResponse(**user) for user in usersList]

def getCurrentUser(userId: str) -> UserResponse:
    """
    利用 ID 取得用戶基本資料 (給授權依賴項使用)
    """
    user = user_repo.getUserById(userId)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="此用戶不存在或已遭刪除"
        )
    return UserResponse(**user)

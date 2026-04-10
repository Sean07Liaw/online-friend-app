from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    avatar: Optional[str] = None
    status: Optional[str] = None
    is_online: Optional[bool] = None

    class Config:
        from_attributes = True

from pydantic import BaseModel

class Token(BaseModel):
    accessToken: str
    tokenType: str

class TokenData(BaseModel):
    userId: str | None = None

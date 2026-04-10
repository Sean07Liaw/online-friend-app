from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from core.config import settings
from fastapi import HTTPException, status

def verifyPassword(plainPassword: str, hashedPassword: str) -> bool:
    """
    驗證用戶輸入的純文本密碼是否與資料庫中的加密字串相符
    """
    return bcrypt.checkpw(
        plainPassword.encode("utf-8"), 
        hashedPassword.encode("utf-8")
    )

def getPasswordHash(password: str) -> str:
    """
    將用戶密碼進行 Hash 加密
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def createAccessToken(data: dict, expiresDelta: timedelta | None = None) -> str:
    """
    產生 JWT Access Token
    """
    toEncode = data.copy()
    if expiresDelta:
        expire = datetime.now(timezone.utc) + expiresDelta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.accessTokenExpireMinutes)
    toEncode.update({"exp": expire})
    encodedJwt = jwt.encode(toEncode, settings.jwtSecretKey, algorithm=settings.jwtAlgorithm)
    return encodedJwt

def decodeAccessToken(token: str) -> dict:
    """
    解析與驗證 JWT Token，若無效則拋出 HttpException
    """
    try:
        payload = jwt.decode(token, settings.jwtSecretKey, algorithms=[settings.jwtAlgorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已過期",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的認證憑證",
            headers={"WWW-Authenticate": "Bearer"},
        )

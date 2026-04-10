import sys
from pathlib import Path
# 把 backend 根目錄加進系統路徑，方便 Python 找到各個 module
sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, users

app = FastAPI(title="Online Friends API")

# 配置 CORS，允許前端 React 發送請求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 生產環境應限制為實際前端網址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊 API 路由 (嚴格禁止在此處做 DB 操作，交由 router 背後的 service -> repo 處理)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
def readRoot():
    """
    根目錄健康檢查
    """
    return {"message": "Welcome to Online Friends API. Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    # 直接以 uvicorn main:app 啟動
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import sys
from pathlib import Path

# 將 backend 路徑加進系統路徑，確保內部的 import (api, core, service) 能正常運作
backend_path = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_path))

from main import app

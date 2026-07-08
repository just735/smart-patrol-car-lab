import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

USERS_PATH = Path(__file__).resolve().parent.parent / "data" / "users.json"
security = HTTPBearer(auto_error=False)


def _hash_password(password: str) -> str:
    salt = settings.jwt_secret[:8]
    return hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()


def _load_users() -> dict:
    if USERS_PATH.exists():
        with USERS_PATH.open("r", encoding="utf-8") as fp:
            return json.load(fp)
    default = {
        "admin": {
            "username": "admin",
            "password_hash": _hash_password("123456"),
            "nickname": "管理员",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    }
    _save_users(default)
    return default


def _save_users(users: dict) -> None:
    USERS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with USERS_PATH.open("w", encoding="utf-8") as fp:
        json.dump(users, fp, ensure_ascii=False, indent=2)


def create_user(username: str, password: str, nickname: str) -> dict:
    users = _load_users()
    if username in users:
        raise HTTPException(status_code=400, detail="用户名已存在")
    users[username] = {
        "username": username,
        "password_hash": _hash_password(password),
        "nickname": nickname or username,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _save_users(users)
    return public_user(users[username])


def authenticate_user(username: str, password: str) -> Optional[dict]:
    users = _load_users()
    user = users.get(username)
    if not user or user["password_hash"] != _hash_password(password):
        return None
    return user


def public_user(user: dict) -> dict:
    return {
        "username": user["username"],
        "nickname": user.get("nickname", user["username"]),
        "created_at": user.get("created_at", ""),
    }


def create_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expire_hours)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return payload["sub"]
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="登录已过期，请重新登录") from exc


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="请先登录")
    username = decode_token(credentials.credentials)
    users = _load_users()
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    return public_user(user)

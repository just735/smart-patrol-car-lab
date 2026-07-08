from fastapi import APIRouter, Depends

from app.auth_store import (
    authenticate_user,
    create_token,
    create_user,
    get_current_user,
    public_user,
)
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserProfile

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register(body: RegisterRequest) -> AuthResponse:
    user = create_user(body.username, body.password, body.nickname)
    token = create_token(user["username"])
    return AuthResponse(token=token, user=UserProfile(**user))


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest) -> AuthResponse:
    user = authenticate_user(body.username, body.password)
    if not user:
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail="用户名或密码错误")
    profile = public_user(user)
    token = create_token(profile["username"])
    return AuthResponse(token=token, user=UserProfile(**profile))


@router.get("/me", response_model=UserProfile)
def me(current_user: dict = Depends(get_current_user)) -> UserProfile:
    return UserProfile(**current_user)

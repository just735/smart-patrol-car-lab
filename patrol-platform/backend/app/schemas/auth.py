from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6, max_length=64)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6, max_length=64)
    nickname: str = Field("", max_length=32)


class UserProfile(BaseModel):
    username: str
    nickname: str
    created_at: str = ""


class AuthResponse(BaseModel):
    token: str
    user: UserProfile

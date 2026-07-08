from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth_store import get_current_user
from app.config import settings
from app.routers.auth import router as auth_router
from app.routers.patrol import router as patrol_router

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(patrol_router)


@app.get("/api/health")
def public_health():
    return {"status": "ok", "service": "patrol-car-api"}


@app.get("/")
def root():
    return {"message": settings.app_name, "docs": "/docs"}

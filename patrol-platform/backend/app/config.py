from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "智能巡检车 API"
    host: str = "0.0.0.0"
    port: int = 8000
    car_ip: str = "192.168.1.11"
    car_port: int = 6000
    car_video_port: int = 6500
    jwt_secret: str = "patrol-car-lab-secret-change-me"
    jwt_expire_hours: int = 72

    class Config:
        env_file = ".env"


settings = Settings()

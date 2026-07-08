import json
from pathlib import Path

from app.config import settings

STORE_PATH = Path(__file__).resolve().parent.parent / "data" / "network.json"


def load_network() -> dict:
    if STORE_PATH.exists():
        with STORE_PATH.open("r", encoding="utf-8") as fp:
            return json.load(fp)
    return {
        "ip": settings.car_ip,
        "port": settings.car_port,
        "video_port": settings.car_video_port,
    }


def save_network(ip: str, port: int, video_port: int) -> dict:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    data = {"ip": ip, "port": port, "video_port": video_port}
    with STORE_PATH.open("w", encoding="utf-8") as fp:
        json.dump(data, fp, ensure_ascii=False, indent=2)
    settings.car_ip = ip
    settings.car_port = port
    settings.car_video_port = video_port
    return data

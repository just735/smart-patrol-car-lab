from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "patrol-car-api"


class DeviceStatusResponse(BaseModel):
    status: str = "idle"
    connected: bool = False
    ip: str
    port: int
    video_port: int
    last_message: str = ""


class ButtonCommand(BaseModel):
    direction: int = Field(..., ge=0, le=7)


class RockerCommand(BaseModel):
    speed_x: float = Field(..., ge=-100, le=100)
    speed_y: float = Field(..., ge=-100, le=100)


class MecanumCommand(BaseModel):
    l1: float = Field(0, ge=-100, le=100)
    l2: float = Field(0, ge=-100, le=100)
    r1: float = Field(0, ge=-100, le=100)
    r2: float = Field(0, ge=-100, le=100)


class TrackingCommand(BaseModel):
    action: str = Field(..., pattern="^(start|stop)$")


class ControlResponse(BaseModel):
    success: bool = True
    message: str
    frame: str = ""


class NetworkConfig(BaseModel):
    ip: str
    port: int = Field(..., ge=1, le=65535)
    video_port: int = Field(6500, ge=1, le=65535)


class NetworkConfigResponse(NetworkConfig):
    saved: bool = True


class ConnectResponse(BaseModel):
    success: bool
    message: str
    connected: bool

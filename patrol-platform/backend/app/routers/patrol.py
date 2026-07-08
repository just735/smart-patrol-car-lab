from fastapi import APIRouter, Depends, HTTPException

from app.auth_store import get_current_user

from app import car_encode
from app.car_enum import CarDirection
from app.network_store import load_network, save_network
from app.schemas.patrol import (
    ButtonCommand,
    ConnectResponse,
    ControlResponse,
    DeviceStatusResponse,
    HealthResponse,
    MecanumCommand,
    NetworkConfig,
    NetworkConfigResponse,
    RockerCommand,
    TrackingCommand,
)
from app.tcp_client import TCPClientManager

router = APIRouter(prefix="/api", tags=["patrol"])


def _send(frame: str, label: str, _: dict = Depends(get_current_user)) -> ControlResponse:
    client = TCPClientManager.get_instance()
    ok = client.send_message(frame)
    if not ok:
        raise HTTPException(status_code=503, detail="TCP 连接失败，请先在网络配置页测试连接")
    return ControlResponse(success=True, message=label, frame=frame)


@router.get("/device/status", response_model=DeviceStatusResponse)
def device_status(_: dict = Depends(get_current_user)) -> DeviceStatusResponse:
    config = load_network()
    client = TCPClientManager.get_instance()
    return DeviceStatusResponse(
        status="connected" if client.is_connected() else "idle",
        connected=client.is_connected(),
        ip=config["ip"],
        port=int(config["port"]),
        video_port=int(config.get("video_port", 6500)),
        last_message=client.last_message,
    )


@router.post("/device/button", response_model=ControlResponse)
def device_button(command: ButtonCommand, _: dict = Depends(get_current_user)) -> ControlResponse:
    direction = CarDirection(command.direction)
    frame = car_encode.button_car_encode(direction)
    return _send(frame, f"按钮控制: {direction.name}")


@router.post("/device/rocker", response_model=ControlResponse)
def device_rocker(command: RockerCommand, _: dict = Depends(get_current_user)) -> ControlResponse:
    frame = car_encode.ctrl_car_encode(command.speed_x, command.speed_y)
    return _send(frame, f"摇杆控制: ({command.speed_x}, {command.speed_y})")


@router.post("/device/mecanum", response_model=ControlResponse)
def device_mecanum(command: MecanumCommand, _: dict = Depends(get_current_user)) -> ControlResponse:
    frame = car_encode.up_speed_car_encode(command.l1, command.l2, command.r1, command.r2)
    return _send(frame, "麦克纳姆轮速度已发送")


@router.post("/device/tracking", response_model=ControlResponse)
def device_tracking(command: TrackingCommand, _: dict = Depends(get_current_user)) -> ControlResponse:
    if command.action == "start":
        frame = car_encode.tracking_open_encode()
        return _send(frame, "开始循迹")
    frame = car_encode.tracking_close_encode()
    return _send(frame, "停止循迹")


@router.post("/device/connect", response_model=ConnectResponse)
def device_connect(_: dict = Depends(get_current_user)) -> ConnectResponse:
    client = TCPClientManager.get_instance()
    config = load_network()
    client.init_address(config["ip"], int(config["port"]))
    ok = client.connect()
    return ConnectResponse(
        success=ok,
        connected=ok,
        message="连接成功" if ok else f"连接失败: {config['ip']}:{config['port']}",
    )


@router.post("/device/disconnect", response_model=ConnectResponse)
def device_disconnect(_: dict = Depends(get_current_user)) -> ConnectResponse:
    client = TCPClientManager.get_instance()
    client.close()
    return ConnectResponse(success=True, connected=False, message="已断开连接")


@router.get("/device/network", response_model=NetworkConfigResponse)
def get_network(_: dict = Depends(get_current_user)) -> NetworkConfigResponse:
    config = load_network()
    return NetworkConfigResponse(
        ip=config["ip"],
        port=int(config["port"]),
        video_port=int(config.get("video_port", 6500)),
        saved=True,
    )


@router.post("/device/network", response_model=NetworkConfigResponse)
def save_network_config(config: NetworkConfig, _: dict = Depends(get_current_user)) -> NetworkConfigResponse:
    save_network(config.ip, config.port, config.video_port)
    TCPClientManager.get_instance().init_address(config.ip, config.port)
    return NetworkConfigResponse(
        ip=config.ip,
        port=config.port,
        video_port=config.video_port,
        saved=True,
    )

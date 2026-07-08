from app.car_enum import CarDirection


def _number_to_hex(num: int, length: int) -> str:
    hex_str = format(num, "X")
    return hex_str.zfill(length)


def _checksum(data: str) -> int:
    total = 0
    for i in range(0, len(data), 2):
        total = (total + int(data[i : i + 2], 16)) % 256
    return total


def _base_encode(msg_type: str, *datas: str) -> str:
    info = "".join(datas)
    size = _number_to_hex(len(info) + 2, 2)
    code = "01" + msg_type + size + info
    code += _number_to_hex(_checksum(code), 2)
    return f"${code}#"


def tracking_open_encode() -> str:
    return _base_encode("63")


def tracking_close_encode() -> str:
    return _base_encode("64")


def take_photos_encode() -> str:
    return _base_encode("60")


def start_recording_encode() -> str:
    return _base_encode("61")


def close_recording_encode() -> str:
    return _base_encode("62")


def ctrl_car_encode(speed_x: float, speed_y: float) -> str:
    send_x = round(speed_x)
    send_y = round(speed_y)
    if send_x < 0:
        send_x += 256
    if send_y < 0:
        send_y += 256
    return _base_encode("10", _number_to_hex(send_x, 2), _number_to_hex(send_y, 2))


def button_car_encode(direction: CarDirection) -> str:
    return _base_encode("15", _number_to_hex(int(direction), 2))


def up_speed_car_encode(l1: float, l2: float, r1: float, r2: float) -> str:
    def fmt(value: float) -> int:
        v = round(value)
        return v + 256 if v < 0 else v

    return _base_encode(
        "21",
        _number_to_hex(fmt(l1), 2),
        _number_to_hex(fmt(l2), 2),
        _number_to_hex(fmt(r1), 2),
        _number_to_hex(fmt(r2), 2),
    )

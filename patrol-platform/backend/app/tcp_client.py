import socket
import threading
from typing import Optional

from app.network_store import load_network


class TCPClientManager:
    _instance: Optional["TCPClientManager"] = None

    def __init__(self) -> None:
        self._sock: Optional[socket.socket] = None
        self._lock = threading.Lock()
        self._last_message = ""
        self._reload_address()

    @classmethod
    def get_instance(cls) -> "TCPClientManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _reload_address(self) -> None:
        config = load_network()
        self._host = config.get("ip", "192.168.1.11")
        self._port = int(config.get("port", 6000))

    def init_address(self, host: str, port: int) -> None:
        self._host = host
        self._port = port

    def is_connected(self) -> bool:
        return self._sock is not None

    def connect(self) -> bool:
        with self._lock:
            self.close()
            self._reload_address()
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            try:
                sock.connect((self._host, self._port))
                self._sock = sock
                return True
            except OSError:
                sock.close()
                self._sock = None
                return False

    def send_message(self, message: str) -> bool:
        with self._lock:
            if self._sock is None and not self.connect():
                return False
            try:
                assert self._sock is not None
                self._sock.sendall(message.encode("utf-8"))
                self._last_message = message
                return True
            except OSError:
                self.close()
                return False

    def close(self) -> None:
        if self._sock is not None:
            try:
                self._sock.close()
            except OSError:
                pass
            self._sock = None

    @property
    def last_message(self) -> str:
        return self._last_message

    @property
    def host(self) -> str:
        return self._host

    @property
    def port(self) -> int:
        return self._port

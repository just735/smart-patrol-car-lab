import socket from '@ohos.net.socket';
import promptAction from '@ohos.promptAction';

class SocketInfo {
  message: ArrayBuffer = new ArrayBuffer(1);
  remoteInfo: socket.SocketRemoteInfo = {} as socket.SocketRemoteInfo;
}

export class TCPClientManager {
  private static instance: TCPClientManager;
  private socket: socket.TCPSocket = socket.constructTCPSocketInstance();
  private options: socket.TCPConnectOptions = {
    address: { address: '127.0.0.1', port: 12345 },
    timeout: 100
  };

  private constructor() {}

  static getInstance(): TCPClientManager {
    if (!TCPClientManager.instance) TCPClientManager.instance = new TCPClientManager();
    return TCPClientManager.instance;
  }

  initNetAddress(netAddress: socket.NetAddress) {
    if (netAddress.address) this.options.address.address = netAddress.address;
    if (netAddress.family) this.options.address.family = netAddress.family;
    if (netAddress.port) this.options.address.port = netAddress.port;
  }

  async connect() {
    if (await this.isConnect()) this.socket.close();
    try {
      await this.socket.bind({ address: '0.0.0.0', family: 1 });
      await this.socket.connect(this.options);
      this.showInfo('连接成功');
      this.socket.on('message', (value: SocketInfo) => {
        let messageView = '';
        const uint8Array = new Uint8Array(value.message);
        for (let i = 0; i < value.message.byteLength; i++) {
          messageView += String.fromCharCode(uint8Array[i]);
        }
        try {
          TCPClientManager._receiveMessage(messageView);
        } catch (e) {
          console.error('TCPClientManager', JSON.stringify(e));
        }
      });
      return true;
    } catch {
      this.socket.close();
      return false;
    }
  }

  async isConnect() {
    const state = await this.socket.getState();
    return state.isClose == false && state.isConnected == true;
  }

  async sendMessage(message: string) {
    if (await this.isConnect()) {
      this.socket.send({ data: message });
      return true;
    }
    await this.connect();
    return false;
  }

  closeConnection() {
    this.socket.close();
  }

  private showInfo(message: string) {
    promptAction.showToast({ message });
  }

  private static _receiveMessage = (message: string) => {};

  public static set receiveMessage(value: (message: string) => void) {
    TCPClientManager._receiveMessage = value;
  }
}
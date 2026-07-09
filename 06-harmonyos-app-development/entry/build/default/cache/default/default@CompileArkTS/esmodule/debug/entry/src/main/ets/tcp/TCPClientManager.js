import socket from '@ohos:net.socket';
import promptAction from '@ohos:promptAction';
class SocketInfo {
    constructor() {
        this.message = new ArrayBuffer(1);
        this.remoteInfo = {};
    }
}
export class TCPClientManager {
    constructor() {
        this.socket = socket.constructTCPSocketInstance();
        this.options = {
            address: { address: '127.0.0.1', port: 12345 },
            timeout: 100
        };
    }
    static getInstance() {
        if (!TCPClientManager.instance)
            TCPClientManager.instance = new TCPClientManager();
        return TCPClientManager.instance;
    }
    initNetAddress(netAddress) {
        if (netAddress.address)
            this.options.address.address = netAddress.address;
        if (netAddress.family)
            this.options.address.family = netAddress.family;
        if (netAddress.port)
            this.options.address.port = netAddress.port;
    }
    async connect() {
        if (await this.isConnect())
            this.socket.close();
        try {
            await this.socket.bind({ address: '0.0.0.0', family: 1 });
            await this.socket.connect(this.options);
            this.showInfo('连接成功');
            this.socket.on('message', (value) => {
                let messageView = '';
                const uint8Array = new Uint8Array(value.message);
                for (let i = 0; i < value.message.byteLength; i++) {
                    messageView += String.fromCharCode(uint8Array[i]);
                }
                try {
                    TCPClientManager._receiveMessage(messageView);
                }
                catch (e) {
                    console.error('TCPClientManager', JSON.stringify(e));
                }
            });
            return true;
        }
        catch (_a) {
            this.socket.close();
            return false;
        }
    }
    async isConnect() {
        const state = await this.socket.getState();
        return state.isClose == false && state.isConnected == true;
    }
    async sendMessage(message) {
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
    showInfo(message) {
        promptAction.showToast({ message });
    }
    static set receiveMessage(value) {
        TCPClientManager._receiveMessage = value;
    }
}
TCPClientManager._receiveMessage = (message) => { };
//# sourceMappingURL=TCPClientManager.js.map
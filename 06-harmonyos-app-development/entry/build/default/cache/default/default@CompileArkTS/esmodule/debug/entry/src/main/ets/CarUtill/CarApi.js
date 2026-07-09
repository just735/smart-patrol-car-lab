import { TCPClientManager } from '@bundle:com.smart.patrol.car/entry/ets/tcp/TCPClientManager';
import { CarEncode } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarEncode';
class CarApi {
    carBtnCtrl(d) {
        this.send(CarEncode.ButtonCarEncode(d));
    }
    send(message) {
        TCPClientManager.getInstance().sendMessage(message);
    }
}
export const carApi = new CarApi();
//# sourceMappingURL=CarApi.js.map
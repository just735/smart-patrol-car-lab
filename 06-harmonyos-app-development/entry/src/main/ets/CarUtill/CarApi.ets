import { TCPClientManager } from '../tcp/TCPClientManager';
import { CarEncode } from './CarEncode';
import { CarDirection } from './CarEnum';

class CarApi {
  carBtnCtrl(d: CarDirection) {
    this.send(CarEncode.ButtonCarEncode(d));
  }

  send(message: string) {
    TCPClientManager.getInstance().sendMessage(message);
  }
}

export const carApi = new CarApi();
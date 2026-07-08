import { TCPClientManager } from './TCPClientManager';

export class TCPClientSendUtils {
  static send(message: string) {
    return TCPClientManager.getInstance().sendMessage(message);
  }
}
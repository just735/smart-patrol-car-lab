import { PreferencesUtils } from '../utils/PreferencesUtils';
import { TCPClientManager } from '../tcp/TCPClientManager';

@Entry
@Component
struct NetworkSettings {
  @State ip: string = '192.168.1.11';
  @State port: string = '6000';

  aboutToAppear(): void {
    const net = PreferencesUtils.getInstance().netUtils;
    if (net) {
      this.ip = net.getIP() as string;
      this.port = net.getTcpPort() as string;
    }
  }

  build() {
    Column({ space: 16 }) {
      Text('网络配置')
        .fontSize($r('app.float.page_title_size'))
        .fontColor($r('app.color.text_primary'))

      TextInput({ text: this.ip, placeholder: '请输入服务器 IP' })
        .onChange((value: string) => this.ip = value)
      TextInput({ text: this.port, placeholder: '请输入端口' })
        .onChange((value: string) => this.port = value)

      Row({ space: 12 }) {
        Button('保存配置').onClick(() => {
          const net = PreferencesUtils.getInstance().netUtils;
          if (net) {
            net.setIp(this.ip);
            net.setTcpPort(this.port);
          }
        })
        Button('连接测试').onClick(() => {
          TCPClientManager.getInstance().initNetAddress({ address: this.ip, port: Number(this.port) });
          TCPClientManager.getInstance().connect();
        })
      }
    }
    .padding(24)
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.window_background'))
  }
}
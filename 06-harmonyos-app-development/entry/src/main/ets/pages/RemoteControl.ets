import { carApi } from '../CarUtill/CarApi';
import { CarEncode } from '../CarUtill/CarEncode';
import { CarBtnComponents } from '../components/CarBtnComponents';
import { CarRockerComponents } from '../components/CarRockerComponents';
import { VideoComponents } from '../components/VideoComponents';

@Entry
@Component
struct RemoteControl {
  @State nowCtrlModel: CtrlModel = CtrlModel.Button;
  ctrlTextTextList: string[] = ['按钮', '摇杆'];
  ctrlModeList: CtrlModel[] = [CtrlModel.Button, CtrlModel.Rocker];

  build() {
    Row() {
      Column() {
        ForEach(this.ctrlTextTextList, (item: string, index: number) => {
          MyTab({ state: this.nowCtrlModel == this.ctrlModeList[index], text: item })
            .onClick(() => this.nowCtrlModel = this.ctrlModeList[index]);
        }, (item: string) => item)
      }
      .width('96vp')
      .height('100%')
      .justifyContent(FlexAlign.Center)

      Column({ space: 14 }) {
        Stack() {
          CarBtnComponents().visibility(this.nowCtrlModel == CtrlModel.Button ? Visibility.Visible : Visibility.None)
          CarRockerComponents().visibility(this.nowCtrlModel == CtrlModel.Rocker ? Visibility.Visible : Visibility.None)
        }
        .width('240vp')
        .height('240vp')

        VideoComponents()
        Row({ space: 12 }) {
          Button('开始循迹').onClick(() => carApi.send(CarEncode.TrackingOpenEncode()))
          Button('停止循迹').onClick(() => carApi.send(CarEncode.TrackingCloseEncode()))
        }
      }
      .layoutWeight(1)
      .padding({ left: 20, right: 20, top: 20, bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.window_background'))
  }
}

enum CtrlModel {
  Button = 0,
  Rocker = 1,
}

@Component
struct MyTab {
  @Prop state: boolean = false;
  @Prop text: string = 'hello';

  build() {
    Text(this.text)
      .width('100%')
      .padding({ left: 12, right: 12, top: 14, bottom: 14 })
      .fontColor($r('app.color.button_text'))
      .backgroundColor(this.state ? $r('app.color.button_select_background') : $r('app.color.button_background'))
      .borderRadius({ topRight: 16, bottomRight: 16 })
  }
}
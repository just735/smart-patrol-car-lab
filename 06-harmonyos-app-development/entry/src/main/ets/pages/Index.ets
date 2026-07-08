import router from '@ohos.router';
import { ButtonShadow } from '../styles/styles';

@Entry
@Component
struct Index {
  build() {
    Column() {
      Column({ space: 10 }) {
        Text($r('app.string.home_title'))
          .fontSize($r('app.float.page_title_size'))
          .fontColor($r('app.color.text_primary'))
          .fontWeight(FontWeight.Bold)
        Text($r('app.string.home_subtitle'))
          .fontSize($r('app.float.content_size'))
          .fontColor($r('app.color.text_secondary'))
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)
      .padding({ left: 24, top: 18, right: 24, bottom: 12 })

      Scroll() {
        Row({ space: 20 }) {
          ItemButton({ text: '远程控制', event: () => router.pushUrl({ url: 'pages/RemoteControl' }) })
          ItemButton({ text: '麦克纳姆轮', event: () => router.pushUrl({ url: 'pages/MecanumWheel' }) })
          ItemButton({ text: '网络配置', event: () => router.pushUrl({ url: 'pages/NetworkSettings' }) })
        }
        .padding({ left: 24, right: 24, top: 20, bottom: 20 })
      }
      .scrollable(ScrollDirection.Horizontal)
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.window_background'))
  }
}

@Component
struct ItemButton {
  @Prop text: string = '';
  @Prop event: () => void = () => {};

  build() {
    Button(this.text)
      .width('240vp')
      .height('180vp')
      .fontSize($r('app.float.index_text_size'))
      .fontColor($r('app.color.button_text'))
      .backgroundColor($r('app.color.button_background'))
      .shadow(ButtonShadow)
      .borderRadius($r('app.float.index_button_radius'))
      .onClick(() => this.event())
  }
}
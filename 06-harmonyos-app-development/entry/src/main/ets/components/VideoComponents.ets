@Component
export struct VideoComponents {
  build() {
    Column() {
      Text('视频流预留区域')
        .fontSize($r('app.float.content_size'))
        .fontColor($r('app.color.text_secondary'))
    }
    .width('100%')
    .height('35%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor($r('app.color.panel_background'))
    .borderRadius($r('app.float.card_radius'))
  }
}
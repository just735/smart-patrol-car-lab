@Entry
@Component
struct MecanumWheel {
  build() {
    Column({ space: 12 }) {
      Text('麦克纳姆轮控制页')
        .fontSize($r('app.float.page_title_size'))
        .fontColor($r('app.color.text_primary'))
      Text('此页面作为后续四轮独立控制实验页的占位初始化。')
        .fontSize($r('app.float.content_size'))
        .fontColor($r('app.color.text_secondary'))
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor($r('app.color.window_background'))
  }
}
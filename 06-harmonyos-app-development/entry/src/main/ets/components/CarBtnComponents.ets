import { carApi } from '../CarUtill/CarApi';
import { CarDirection } from '../CarUtill/CarEnum';
import { ButtonShadow } from '../styles/styles';

@Component
export struct CarBtnComponents {
  build() {
    Grid() {
      GridItem() { Button('左转').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.LeftRotate))) }
      GridItem() { Button('前').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Front))) }
      GridItem() { Button('右转').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.RightRotate))) }
      GridItem() { Button('左').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Left))) }
      GridItem() { Button('停').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Brake))) }
      GridItem() { Button('右').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Right))) }
      GridItem()
      GridItem() { Button('后').width('100%').height('100%').backgroundColor($r('app.color.button_background')).shadow(ButtonShadow).onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.After))) }
      GridItem()
    }.rowsTemplate('1fr 1fr 1fr').columnsTemplate('1fr 1fr 1fr')
  }

  makeTouchEvent(upEvent: (event?: TouchEvent) => void) {
    return (event?: TouchEvent) => {
      if (!event) return;
      if (event.type === TouchType.Up) {
        carApi.carBtnCtrl(CarDirection.Stop);
      } else if (event.type === TouchType.Down) {
        upEvent(event);
      }
    }
  }
}
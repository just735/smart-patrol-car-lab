import { RockerComponent } from '../../../../../Rocker/src/main/ets/components/RockerComponent';
import { CarEncode } from '../CarUtill/CarEncode';
import { carApi } from '../CarUtill/CarApi';

@Component
export struct CarRockerComponents {
  build() {
    Column() {
      RockerComponent({
        width: 220,
        height: 220,
        tiltWidth: 48,
        canveWidth: 220,
        canveHeight: 220,
        tiltEvent: (tiltX: number, tiltY: number) => {
          carApi.send(CarEncode.CtrlCarEncode(tiltX, tiltY));
        }
      })
    }
  }
}
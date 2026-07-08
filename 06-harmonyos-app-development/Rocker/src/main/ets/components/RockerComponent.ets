import { RockerDrawUtils } from './RockerUtils/RockerDrawUtils';
import { iRockerOptions } from './RockerUtils/RockerOptions';

@Component
struct RockerComponent {
  rockerOptions: iRockerOptions;
  private settings: RenderingContextSettings = new RenderingContextSettings(true);
  private ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings);
  private drawUtils: RockerDrawUtils = new RockerDrawUtils(this.ctx);
  private AreaValue?: Area;

  aboutToAppear(): void {
    this.drawUtils.init(this.rockerOptions);
  }

  build() {
    Canvas(this.ctx)
      .onReady(() => this.drawUtils.myOnReadyEvent())
      .onTouch((event) => this.myOnTouchEvent(event))
      .onAreaChange((oldValue: Area, newValue: Area) => {
        this.AreaValue = newValue;
        if (this.AreaValue) {
          const w = this.AreaValue.width as number;
          const h = this.AreaValue.height as number;
          this.drawUtils.setTiltXY(w / 2, h / 2);
          this.drawUtils.setSize(w, h);
        }
        this.drawUtils.myOnReadyEvent();
      })
  }

  private myOnTouchEvent(event?: TouchEvent) {
    if (!event) return;
    if (event.type === TouchType.Up) {
      if (this.AreaValue) {
        this.drawUtils.setTiltXY((this.AreaValue.width as number) / 2, (this.AreaValue.height as number) / 2);
      }
      this.drawUtils.myOnReadyEvent();
    } else if (event.type === TouchType.Move) {
      this.drawUtils.setTiltXY(event.touches[0].x, event.touches[0].y);
      this.drawUtils.myOnReadyEvent();
    }

    const xmap = (x: number, w: number, l: number, r: number) => x / (w - 0) * (r - l) + l;
    let tiltX = xmap(this.drawUtils.tiltX, this.drawUtils.width, -100, 100);
    let tiltY = xmap(this.drawUtils.tiltY, this.drawUtils.height, -100, 100);
    tiltY *= -1;
    this.rockerOptions.tiltEvent?.(tiltX, tiltY, event);
  }
}

export { RockerComponent }
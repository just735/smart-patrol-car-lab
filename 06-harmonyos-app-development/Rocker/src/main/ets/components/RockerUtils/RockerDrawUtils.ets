import { iRockerOptions } from './RockerOptions';

export class RockerDrawUtils {
  width: number = 0;
  height: number = 0;
  tiltX: number = 0;
  tiltY: number = 0;

  constructor(private ctx: CanvasRenderingContext2D) {}

  init(options: iRockerOptions) {
    this.width = options.canveWidth ?? 220;
    this.height = options.canveHeight ?? 220;
    this.tiltX = this.width / 2;
    this.tiltY = this.height / 2;
  }

  setTiltXY(x: number, y: number) {
    this.tiltX = x;
    this.tiltY = y;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  myOnReadyEvent() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#20304A';
    ctx.beginPath();
    ctx.arc(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2 - 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF8A3D';
    ctx.beginPath();
    ctx.arc(this.tiltX, this.tiltY, 28, 0, Math.PI * 2);
    ctx.fill();
  }
}
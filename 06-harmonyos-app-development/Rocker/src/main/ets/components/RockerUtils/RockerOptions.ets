export type GetImageBitmap = () => ImageBitmap

@Observed
export class RockerOptions implements iRockerOptions {
  width?: number;
  height?: number;
  tiltWidth?: number;
  canveWidth?: number;
  canveHeight?: number;
  getTiltStyle?: GetImageBitmap;
  getBackgroundStyle?: GetImageBitmap;
  tiltEvent?: (tiltX: number, tiltY: number, event?: TouchEvent) => void;

  constructor(i?: iRockerOptions) {
    if (!i) return;
    this.width = i.width;
    this.height = i.height;
    this.tiltWidth = i.tiltWidth;
    this.canveWidth = i.canveWidth;
    this.canveHeight = i.canveHeight;
    this.getTiltStyle = i.getTiltStyle;
    this.getBackgroundStyle = i.getBackgroundStyle;
    this.tiltEvent = i.tiltEvent;
  }
}

export interface iRockerOptions {
  width?: number;
  height?: number;
  tiltWidth?: number;
  canveWidth?: number;
  canveHeight?: number;
  getTiltStyle?: GetImageBitmap;
  getBackgroundStyle?: GetImageBitmap;
  tiltEvent?: (tiltX: number, tiltY: number, event?: TouchEvent) => void;
}
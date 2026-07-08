import { MyUtils } from '../utils/MyUtils';
import { CarDirection } from './CarEnum';

const isDebug = MyUtils.isDebug;

export namespace CarEncode {
  export function TrackingOpenEncode(): string { return BaseEncode('63'); }
  export function TrackingCloseEncode(): string { return BaseEncode('64'); }
  export function TakePhotosEncode(): string { return BaseEncode('60'); }
  export function StartRecordingEncode(): string { return BaseEncode('61'); }
  export function CloselRecordingEncode(): string { return BaseEncode('62'); }
  export function CtrlCarEncode(speed_x: number, speed_y: number): string {
    let send_x = Math.round(speed_x);
    let send_y = Math.round(speed_y);
    if (send_x < 0) send_x += 256;
    if (send_y < 0) send_y += 256;
    return BaseEncode('10', numberToHex(send_x, 2), numberToHex(send_y, 2));
  }
  export function ButtonCarEncode(d: CarDirection): string { return BaseEncode('15', numberToHex(d, 2)); }
  export function UpSpeedCarEncode(l1: number, l2: number, r1: number, r2: number): string {
    const format = (x: number) => { x = Math.round(x); if (x < 0) x += 256; return x; };
    return BaseEncode('21', numberToHex(format(l1), 2), numberToHex(format(l2), 2), numberToHex(format(r1), 2), numberToHex(format(r2), 2));
  }
  function BaseEncode(type: string, ...datas: string[]) {
    const info = datas.join('');
    const size = numberToHex(info.length + 2, 2);
    let code = '01' + type + size + info;
    code += numberToHex(getCheckChecksum(code), 2);
    return `$${code}#`;
  }
  function numberToHex(num: number, len: number) {
    let hex = num.toString(16).toUpperCase();
    while (hex.length < len) hex = '0' + hex;
    return hex;
  }
  function getCheckChecksum(data: string) {
    let calculatedChecksum = 0;
    for (let i = 0; i < data.length; i += 2) {
      calculatedChecksum = (calculatedChecksum + parseInt(data.substr(i, 2), 16)) % 256;
    }
    if (isDebug) console.log('CarEncode checksum', calculatedChecksum);
    return calculatedChecksum;
  }
}
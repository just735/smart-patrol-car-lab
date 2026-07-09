import { MyUtils } from '@bundle:com.smart.patrol.car/entry/ets/utils/MyUtils';
const isDebug = MyUtils.isDebug;
export var CarEncode;
(function (CarEncode) {
    function TrackingOpenEncode() { return BaseEncode('63'); }
    CarEncode.TrackingOpenEncode = TrackingOpenEncode;
    function TrackingCloseEncode() { return BaseEncode('64'); }
    CarEncode.TrackingCloseEncode = TrackingCloseEncode;
    function TakePhotosEncode() { return BaseEncode('60'); }
    CarEncode.TakePhotosEncode = TakePhotosEncode;
    function StartRecordingEncode() { return BaseEncode('61'); }
    CarEncode.StartRecordingEncode = StartRecordingEncode;
    function CloselRecordingEncode() { return BaseEncode('62'); }
    CarEncode.CloselRecordingEncode = CloselRecordingEncode;
    function CtrlCarEncode(speed_x, speed_y) {
        let send_x = Math.round(speed_x);
        let send_y = Math.round(speed_y);
        if (send_x < 0)
            send_x += 256;
        if (send_y < 0)
            send_y += 256;
        return BaseEncode('10', numberToHex(send_x, 2), numberToHex(send_y, 2));
    }
    CarEncode.CtrlCarEncode = CtrlCarEncode;
    function ButtonCarEncode(d) { return BaseEncode('15', numberToHex(d, 2)); }
    CarEncode.ButtonCarEncode = ButtonCarEncode;
    function UpSpeedCarEncode(l1, l2, r1, r2) {
        const format = (x) => { x = Math.round(x); if (x < 0)
            x += 256; return x; };
        return BaseEncode('21', numberToHex(format(l1), 2), numberToHex(format(l2), 2), numberToHex(format(r1), 2), numberToHex(format(r2), 2));
    }
    CarEncode.UpSpeedCarEncode = UpSpeedCarEncode;
    function BaseEncode(type, ...datas) {
        const info = datas.join('');
        const size = numberToHex(info.length + 2, 2);
        let code = '01' + type + size + info;
        code += numberToHex(getCheckChecksum(code), 2);
        return `$${code}#`;
    }
    function numberToHex(num, len) {
        let hex = num.toString(16).toUpperCase();
        while (hex.length < len)
            hex = '0' + hex;
        return hex;
    }
    function getCheckChecksum(data) {
        let calculatedChecksum = 0;
        for (let i = 0; i < data.length; i += 2) {
            calculatedChecksum = (calculatedChecksum + parseInt(data.substr(i, 2), 16)) % 256;
        }
        if (isDebug)
            console.log('CarEncode checksum', calculatedChecksum);
        return calculatedChecksum;
    }
})(CarEncode || (CarEncode = {}));
//# sourceMappingURL=CarEncode.js.map
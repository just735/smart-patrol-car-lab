export class RockerDrawUtils {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = 0;
        this.height = 0;
        this.tiltX = 0;
        this.tiltY = 0;
    }
    init(options) {
        var _a, _b;
        this.width = (_a = options.canveWidth) !== null && _a !== void 0 ? _a : 220;
        this.height = (_b = options.canveHeight) !== null && _b !== void 0 ? _b : 220;
        this.tiltX = this.width / 2;
        this.tiltY = this.height / 2;
    }
    setTiltXY(x, y) {
        this.tiltX = x;
        this.tiltY = y;
    }
    setSize(width, height) {
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
//# sourceMappingURL=RockerDrawUtils.js.map
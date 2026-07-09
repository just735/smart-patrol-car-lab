import { RockerDrawUtils } from '@bundle:com.smart.patrol.car/entry@Rocker/ets/components/RockerUtils/RockerDrawUtils';
class RockerComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.rockerOptions = undefined;
        this.settings = new RenderingContextSettings(true);
        this.ctx = new CanvasRenderingContext2D(this.settings);
        this.drawUtils = new RockerDrawUtils(this.ctx);
        this.AreaValue = undefined;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.rockerOptions !== undefined) {
            this.rockerOptions = params.rockerOptions;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.ctx !== undefined) {
            this.ctx = params.ctx;
        }
        if (params.drawUtils !== undefined) {
            this.drawUtils = params.drawUtils;
        }
        if (params.AreaValue !== undefined) {
            this.AreaValue = params.AreaValue;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    aboutToAppear() {
        this.drawUtils.init(this.rockerOptions);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Canvas.create(this.ctx);
            Canvas.onReady(() => this.drawUtils.myOnReadyEvent());
            Canvas.onTouch((event) => this.myOnTouchEvent(event));
            Canvas.onAreaChange((oldValue, newValue) => {
                this.AreaValue = newValue;
                if (this.AreaValue) {
                    const w = this.AreaValue.width;
                    const h = this.AreaValue.height;
                    this.drawUtils.setTiltXY(w / 2, h / 2);
                    this.drawUtils.setSize(w, h);
                }
                this.drawUtils.myOnReadyEvent();
            });
            if (!isInitialRender) {
                Canvas.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Canvas.pop();
    }
    myOnTouchEvent(event) {
        var _a, _b;
        if (!event)
            return;
        if (event.type === TouchType.Up) {
            if (this.AreaValue) {
                this.drawUtils.setTiltXY(this.AreaValue.width / 2, this.AreaValue.height / 2);
            }
            this.drawUtils.myOnReadyEvent();
        }
        else if (event.type === TouchType.Move) {
            this.drawUtils.setTiltXY(event.touches[0].x, event.touches[0].y);
            this.drawUtils.myOnReadyEvent();
        }
        const xmap = (x, w, l, r) => x / (w - 0) * (r - l) + l;
        let tiltX = xmap(this.drawUtils.tiltX, this.drawUtils.width, -100, 100);
        let tiltY = xmap(this.drawUtils.tiltY, this.drawUtils.height, -100, 100);
        tiltY *= -1;
        (_b = (_a = this.rockerOptions).tiltEvent) === null || _b === void 0 ? void 0 : _b.call(_a, tiltX, tiltY, event);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { RockerComponent };
//# sourceMappingURL=RockerComponent.js.map
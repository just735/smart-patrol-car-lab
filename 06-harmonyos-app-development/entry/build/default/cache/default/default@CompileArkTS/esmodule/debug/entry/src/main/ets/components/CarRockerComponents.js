import { RockerComponent } from '@bundle:com.smart.patrol.car/entry@Rocker/ets/components/RockerComponent';
import { CarEncode } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarEncode';
import { carApi } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarApi';
export class CarRockerComponents extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            __Common__.create();
            __Common__.width(220);
            __Common__.height(220);
            if (!isInitialRender) {
                __Common__.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new RockerComponent(this, {
                        rockerOptions: {
                            width: 220,
                            height: 220,
                            tiltWidth: 48,
                            canveWidth: 220,
                            canveHeight: 220,
                            tiltEvent: (tiltX, tiltY) => {
                                carApi.send(CarEncode.CtrlCarEncode(tiltX, tiltY));
                            }
                        }
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        __Common__.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
//# sourceMappingURL=CarRockerComponents.js.map
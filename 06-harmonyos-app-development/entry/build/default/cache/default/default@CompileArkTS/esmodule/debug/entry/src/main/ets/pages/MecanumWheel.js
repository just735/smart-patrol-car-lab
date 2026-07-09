"use strict";
class MecanumWheel extends ViewPU {
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
            Column.create({ space: 12 });
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor({ "id": 33554459, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('麦克纳姆轮控制页');
            Text.fontSize({ "id": 33554464, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontColor({ "id": 33554455, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('此页面作为后续四轮独立控制实验页的占位初始化。');
            Text.fontSize({ "id": 33554461, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontColor({ "id": 33554456, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new MecanumWheel(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=MecanumWheel.js.map
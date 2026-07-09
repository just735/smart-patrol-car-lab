import router from '@ohos:router';
import { ButtonShadow } from '@bundle:com.smart.patrol.car/entry/ets/styles/styles';
class Index extends ViewPU {
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
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 33554459, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 10 });
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 24, top: 18, right: 24, bottom: 12 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create({ "id": 33554440, "type": 10003, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontSize({ "id": 33554464, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontColor({ "id": 33554455, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create({ "id": 33554439, "type": 10003, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontSize({ "id": 33554461, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.fontColor({ "id": 33554456, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Scroll.create();
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.width('100%');
            Scroll.layoutWeight(1);
            if (!isInitialRender) {
                Scroll.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create({ space: 20 });
            Row.padding({ left: 24, right: 24, top: 20, bottom: 20 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new ItemButton(this, { text: '远程控制', url: 'pages/RemoteControl' }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: '远程控制', url: 'pages/RemoteControl'
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new ItemButton(this, { text: '麦克纳姆轮', url: 'pages/MecanumWheel' }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: '麦克纳姆轮', url: 'pages/MecanumWheel'
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new ItemButton(this, { text: '网络配置', url: 'pages/NetworkSettings' }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: '网络配置', url: 'pages/NetworkSettings'
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        Row.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class ItemButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.__url = new SynchedPropertySimpleOneWayPU(params.url, this, "url");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
    }
    updateStateVars(params) {
        this.__text.reset(params.text);
        this.__url.reset(params.url);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__text.purgeDependencyOnElmtId(rmElmtId);
        this.__url.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__text.aboutToBeDeleted();
        this.__url.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.__text.get();
    }
    set text(newValue) {
        this.__text.set(newValue);
    }
    get url() {
        return this.__url.get();
    }
    set url(newValue) {
        this.__url.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel(this.text);
            Button.width('240vp');
            Button.height('180vp');
            Button.fontSize({ "id": 33554463, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.fontColor({ "id": 33554450, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.shadow(ButtonShadow);
            Button.borderRadius({ "id": 33554462, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.onClick(() => {
                router.pushUrl({ url: this.url });
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map
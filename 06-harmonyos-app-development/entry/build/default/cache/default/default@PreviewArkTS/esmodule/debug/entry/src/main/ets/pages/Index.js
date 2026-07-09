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
            Column.debugLine("pages/Index.ets(8:5)");
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
            Column.debugLine("pages/Index.ets(9:7)");
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
            Text.debugLine("pages/Index.ets(10:9)");
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
            Text.debugLine("pages/Index.ets(14:9)");
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
            Scroll.debugLine("pages/Index.ets(22:7)");
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
            Row.debugLine("pages/Index.ets(23:9)");
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
                        text: '远程控制'
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
                        text: '麦克纳姆轮'
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
                        text: '网络配置'
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
        this.__event = new SynchedPropertyObjectOneWayPU(params.event, this, "event");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.text !== undefined) {
            this.__text.set(params.text);
        }
        else {
            this.__text.set('');
        }
        if (params.event !== undefined) {
            this.__event.set(params.event);
        }
        else {
            this.__event.set(() => { });
        }
    }
    updateStateVars(params) {
        this.__text.reset(params.text);
        this.__event.reset(params.event);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__text.purgeDependencyOnElmtId(rmElmtId);
        this.__event.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__text.aboutToBeDeleted();
        this.__event.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get text() {
        return this.__text.get();
    }
    set text(newValue) {
        this.__text.set(newValue);
    }
    get event() {
        return this.__event.get();
    }
    set event(newValue) {
        this.__event.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel(this.text);
            Button.debugLine("pages/Index.ets(46:5)");
            Button.width('240vp');
            Button.height('180vp');
            Button.fontSize({ "id": 33554463, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.fontColor({ "id": 33554450, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.shadow(ButtonShadow);
            Button.borderRadius({ "id": 33554462, "type": 10002, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Button.onClick(() => this.event());
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
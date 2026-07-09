import { carApi } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarApi';
import { CarEncode } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarEncode';
import { CarBtnComponents } from '@bundle:com.smart.patrol.car/entry/ets/components/CarBtnComponents';
import { CarRockerComponents } from '@bundle:com.smart.patrol.car/entry/ets/components/CarRockerComponents';
import { VideoComponents } from '@bundle:com.smart.patrol.car/entry/ets/components/VideoComponents';
class RemoteControl extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__nowCtrlModel = new ObservedPropertySimplePU(CtrlModel.Button, this, "nowCtrlModel");
        this.ctrlTextTextList = ['按钮', '摇杆'];
        this.ctrlModeList = [CtrlModel.Button, CtrlModel.Rocker];
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.nowCtrlModel !== undefined) {
            this.nowCtrlModel = params.nowCtrlModel;
        }
        if (params.ctrlTextTextList !== undefined) {
            this.ctrlTextTextList = params.ctrlTextTextList;
        }
        if (params.ctrlModeList !== undefined) {
            this.ctrlModeList = params.ctrlModeList;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__nowCtrlModel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__nowCtrlModel.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get nowCtrlModel() {
        return this.__nowCtrlModel.get();
    }
    set nowCtrlModel(newValue) {
        this.__nowCtrlModel.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.height('100%');
            Row.backgroundColor({ "id": 33554459, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('96vp');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    __Common__.create();
                    __Common__.onClick(() => this.nowCtrlModel = this.ctrlModeList[index]);
                    if (!isInitialRender) {
                        __Common__.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        if (isInitialRender) {
                            ViewPU.create(new MyTab(this, { state: this.nowCtrlModel == this.ctrlModeList[index], text: item }, undefined, elmtId));
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                state: this.nowCtrlModel == this.ctrlModeList[index], text: item
                            });
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                }
                __Common__.pop();
            };
            this.forEachUpdateFunction(elmtId, this.ctrlTextTextList, forEachItemGenFunction, (item) => item, true, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 14 });
            Column.layoutWeight(1);
            Column.padding({ left: 20, right: 20, top: 20, bottom: 20 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Stack.create();
            Stack.width('240vp');
            Stack.height('240vp');
            if (!isInitialRender) {
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            __Common__.create();
            __Common__.visibility(this.nowCtrlModel == CtrlModel.Button ? Visibility.Visible : Visibility.None);
            if (!isInitialRender) {
                __Common__.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new CarBtnComponents(this, {}, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        __Common__.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            __Common__.create();
            __Common__.visibility(this.nowCtrlModel == CtrlModel.Rocker ? Visibility.Visible : Visibility.None);
            if (!isInitialRender) {
                __Common__.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new CarRockerComponents(this, {}, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        __Common__.pop();
        Stack.pop();
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new VideoComponents(this, {}, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create({ space: 12 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('开始循迹');
            Button.onClick(() => carApi.send(CarEncode.TrackingOpenEncode()));
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('停止循迹');
            Button.onClick(() => carApi.send(CarEncode.TrackingCloseEncode()));
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Row.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
var CtrlModel;
(function (CtrlModel) {
    CtrlModel[CtrlModel["Button"] = 0] = "Button";
    CtrlModel[CtrlModel["Rocker"] = 1] = "Rocker";
})(CtrlModel || (CtrlModel = {}));
class MyTab extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__state = new SynchedPropertySimpleOneWayPU(params.state, this, "state");
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.state !== undefined) {
            this.__state.set(params.state);
        }
        else {
            this.__state.set(false);
        }
        if (params.text !== undefined) {
            this.__text.set(params.text);
        }
        else {
            this.__text.set('hello');
        }
    }
    updateStateVars(params) {
        this.__state.reset(params.state);
        this.__text.reset(params.text);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__state.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__state.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get state() {
        return this.__state.get();
    }
    set state(newValue) {
        this.__state.set(newValue);
    }
    get text() {
        return this.__text.get();
    }
    set text(newValue) {
        this.__text.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.text);
            Text.width('100%');
            Text.padding({ left: 12, right: 12, top: 14, bottom: 14 });
            Text.fontColor({ "id": 33554450, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.backgroundColor(this.state ? { "id": 33554449, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" } : { "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
            Text.borderRadius({ topRight: 16, bottomRight: 16 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new RemoteControl(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=RemoteControl.js.map
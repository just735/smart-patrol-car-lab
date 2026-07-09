import { PreferencesUtils } from '@bundle:com.smart.patrol.car/entry/ets/utils/PreferencesUtils';
import { TCPClientManager } from '@bundle:com.smart.patrol.car/entry/ets/tcp/TCPClientManager';
class NetworkSettings extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__ip = new ObservedPropertySimplePU('192.168.1.11', this, "ip");
        this.__port = new ObservedPropertySimplePU('6000', this, "port");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.ip !== undefined) {
            this.ip = params.ip;
        }
        if (params.port !== undefined) {
            this.port = params.port;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__ip.purgeDependencyOnElmtId(rmElmtId);
        this.__port.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__ip.aboutToBeDeleted();
        this.__port.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get ip() {
        return this.__ip.get();
    }
    set ip(newValue) {
        this.__ip.set(newValue);
    }
    get port() {
        return this.__port.get();
    }
    set port(newValue) {
        this.__port.set(newValue);
    }
    async aboutToAppear() {
        const net = PreferencesUtils.getInstance().netUtils;
        if (net) {
            this.ip = await net.getIP();
            this.port = await net.getTcpPort();
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 16 });
            Column.padding(24);
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
            Text.create('网络配置');
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
            TextInput.create({ text: this.ip, placeholder: '请输入服务器 IP' });
            TextInput.onChange((value) => this.ip = value);
            if (!isInitialRender) {
                TextInput.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            TextInput.create({ text: this.port, placeholder: '请输入端口' });
            TextInput.onChange((value) => this.port = value);
            if (!isInitialRender) {
                TextInput.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
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
            Button.createWithLabel('保存配置');
            Button.onClick(() => {
                const net = PreferencesUtils.getInstance().netUtils;
                if (net) {
                    net.setIp(this.ip);
                    net.setTcpPort(this.port);
                }
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('连接测试');
            Button.onClick(() => {
                TCPClientManager.getInstance().initNetAddress({ address: this.ip, port: Number(this.port) });
                TCPClientManager.getInstance().connect();
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new NetworkSettings(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=NetworkSettings.js.map
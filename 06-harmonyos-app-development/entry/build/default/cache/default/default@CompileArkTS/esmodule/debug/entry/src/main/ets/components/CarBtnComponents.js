import { carApi } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarApi';
import { CarDirection } from '@bundle:com.smart.patrol.car/entry/ets/CarUtill/CarEnum';
import { ButtonShadow } from '@bundle:com.smart.patrol.car/entry/ets/styles/styles';
export class CarBtnComponents extends ViewPU {
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
            Grid.create();
            Grid.rowsTemplate('1fr 1fr 1fr');
            Grid.columnsTemplate('1fr 1fr 1fr');
            if (!isInitialRender) {
                Grid.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('左转');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.LeftRotate)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('左转');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.LeftRotate)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('前');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Front)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('前');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Front)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('右转');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.RightRotate)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('右转');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.RightRotate)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('左');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Left)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('左');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Left)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('停');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Brake)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('停');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Brake)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('右');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Right)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('右');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.Right)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('后');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.After)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    Button.createWithLabel('后');
                    Button.width('100%');
                    Button.height('100%');
                    Button.backgroundColor({ "id": 33554448, "type": 10001, params: [], "bundleName": "com.smart.patrol.car", "moduleName": "entry" });
                    Button.shadow(ButtonShadow);
                    Button.onTouch(this.makeTouchEvent(() => carApi.carBtnCtrl(CarDirection.After)));
                    if (!isInitialRender) {
                        Button.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                Button.pop();
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        {
            const isLazyCreate = true && (Grid.willUseProxy() === true);
            const itemCreation = (elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                GridItem.create(deepRenderFunction, isLazyCreate);
                if (!isInitialRender) {
                    GridItem.pop();
                }
                ViewStackProcessor.StopGetAccessRecording();
            };
            const observedShallowRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const observedDeepRender = () => {
                this.observeComponentCreation(itemCreation);
                GridItem.pop();
            };
            const deepRenderFunction = (elmtId, isInitialRender) => {
                itemCreation(elmtId, isInitialRender);
                this.updateFuncByElmtId.set(elmtId, itemCreation);
                GridItem.pop();
            };
            if (isLazyCreate) {
                observedShallowRender();
            }
            else {
                observedDeepRender();
            }
        }
        Grid.pop();
    }
    makeTouchEvent(upEvent) {
        return (event) => {
            if (!event)
                return;
            if (event.type === TouchType.Up) {
                carApi.carBtnCtrl(CarDirection.Stop);
            }
            else if (event.type === TouchType.Down) {
                upEvent(event);
            }
        };
    }
    rerender() {
        this.updateDirtyElements();
    }
}
//# sourceMappingURL=CarBtnComponents.js.map
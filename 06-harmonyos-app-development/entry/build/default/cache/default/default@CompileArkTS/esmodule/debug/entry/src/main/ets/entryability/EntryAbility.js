import UIAbility from '@ohos:app.ability.UIAbility';
import hilog from '@ohos:hilog';
import { ScreenUtils } from '@bundle:com.smart.patrol.car/entry/ets/utils/ScreenUtils';
import { PreferencesUtils } from '@bundle:com.smart.patrol.car/entry/ets/utils/PreferencesUtils';
export default class EntryAbility extends UIAbility {
    onCreate(want, launchParam) {
        hilog.info(0x0000, 'smart-patrol-car', '%{public}s', 'EntryAbility onCreate');
        PreferencesUtils.getInstance().init(this.context);
    }
    onWindowStageCreate(windowStage) {
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(0x0000, 'smart-patrol-car', 'Failed to load content: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(0x0000, 'smart-patrol-car', 'Succeeded in loading content');
        });
        ScreenUtils.setLandscape(this.context);
        ScreenUtils.keepScreenOn(this.context, true);
        ScreenUtils.setSystemBarEnable_api10(windowStage);
    }
}
//# sourceMappingURL=EntryAbility.js.map
import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import UIAbility from '@ohos.app.ability.UIAbility';
import Want from '@ohos.app.ability.Want';
import window from '@ohos.window';
import hilog from '@ohos.hilog';
import { ScreenUtils } from '../utils/ScreenUtils';
import { PreferencesUtils } from '../utils/PreferencesUtils';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'smart-patrol-car', '%{public}s', 'EntryAbility onCreate');
    PreferencesUtils.getInstance().init(this.context);
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
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
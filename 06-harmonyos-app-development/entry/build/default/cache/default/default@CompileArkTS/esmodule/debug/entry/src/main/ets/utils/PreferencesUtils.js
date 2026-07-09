import preferences from '@ohos:data.preferences';
export class PreferencesUtils {
    constructor() { }
    static getInstance() {
        if (!PreferencesUtils.instance) {
            PreferencesUtils.instance = new PreferencesUtils();
        }
        return PreferencesUtils.instance;
    }
    async init(context) {
        this.netUtils = new NetInfoPreferencesUtils(context);
    }
}
PreferencesUtils.instance = undefined;
export class NetInfoPreferencesUtils {
    constructor(context) {
        this.init(context);
    }
    async init(context) {
        this.pref = await preferences.getPreferences(context, NetInfoPreferencesUtils.NAME);
    }
    async getIP() {
        return await this.pref.get(NetInfoPreferencesUtils.KEY_IP, '192.168.1.11');
    }
    setIp(v) { this.pref.put(NetInfoPreferencesUtils.KEY_IP, v); this.pref.flush(); }
    async getTcpPort() {
        return await this.pref.get(NetInfoPreferencesUtils.KEY_TCP_PORT, '6000');
    }
    setTcpPort(v) { this.pref.put(NetInfoPreferencesUtils.KEY_TCP_PORT, v); this.pref.flush(); }
    setVideoPort(v) { this.pref.put(NetInfoPreferencesUtils.KEY_VIDEO_PORT, v); this.pref.flush(); }
    async getVideoPort() {
        return await this.pref.get(NetInfoPreferencesUtils.KEY_VIDEO_PORT, '6500');
    }
}
NetInfoPreferencesUtils.NAME = 'net_preferences_utils';
NetInfoPreferencesUtils.KEY_IP = 'KEY_IP';
NetInfoPreferencesUtils.KEY_TCP_PORT = 'KEY_TCP_PORT';
NetInfoPreferencesUtils.KEY_VIDEO_PORT = 'KEY_TCP_VIDEO';
//# sourceMappingURL=PreferencesUtils.js.map
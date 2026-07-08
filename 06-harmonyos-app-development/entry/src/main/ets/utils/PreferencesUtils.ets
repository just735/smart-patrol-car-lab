import preferences from '@ohos.data.preferences';

export class PreferencesUtils {
  private static instance: PreferencesUtils | undefined = undefined;
  netUtils!: NetInfoPreferencesUtils;

  private constructor() {}

  static getInstance(): PreferencesUtils {
    if (!PreferencesUtils.instance) {
      PreferencesUtils.instance = new PreferencesUtils();
    }
    return PreferencesUtils.instance;
  }

  async init(context: Context) {
    this.netUtils = new NetInfoPreferencesUtils(context);
  }
}

export class NetInfoPreferencesUtils {
  public static readonly NAME = 'net_preferences_utils';
  public static readonly KEY_IP = 'KEY_IP';
  public static readonly KEY_TCP_PORT = 'KEY_TCP_PORT';
  public static readonly KEY_VIDEO_PORT = 'KEY_TCP_VIDEO';
  private pref!: preferences.Preferences;

  constructor(context: Context) {
    this.init(context);
  }

  private async init(context: Context) {
    this.pref = await preferences.getPreferences(context, NetInfoPreferencesUtils.NAME);
  }

  getIP() { return this.pref.get(NetInfoPreferencesUtils.KEY_IP, '192.168.1.11'); }
  setIp(v: string) { this.pref.put(NetInfoPreferencesUtils.KEY_IP, v); this.pref.flush(); }
  getTcpPort() { return this.pref.get(NetInfoPreferencesUtils.KEY_TCP_PORT, '6000'); }
  setTcpPort(v: string) { this.pref.put(NetInfoPreferencesUtils.KEY_TCP_PORT, v); this.pref.flush(); }
  setVideoPort(v: string) { this.pref.put(NetInfoPreferencesUtils.KEY_VIDEO_PORT, v); this.pref.flush(); }
  getVideoPort() { return this.pref.get(NetInfoPreferencesUtils.KEY_VIDEO_PORT, '6500'); }
}
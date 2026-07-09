<template>
  <view class="page">
    <view class="profile-header">
      <view class="profile-bg"></view>
      <view class="profile-bg profile-bg-2"></view>
      <view class="profile-body">
        <view class="avatar">
          <text>{{ avatarText }}</text>
          <view class="avatar-ring"></view>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ profile.nickname || profile.username }}</text>
          <text class="username">@{{ profile.username }}</text>
          <view class="role-tag">管理员</view>
        </view>
      </view>
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">网络配置</text>
        <text class="ui-section-extra">TCP 通信</text>
      </view>
      <text class="ui-section-desc">配置小车 IP 地址与通信端口</text>
    </view>

    <view class="settings-group">
      <view class="setting-cell">
        <view class="cell-left">
          <view class="cell-icon ip">IP</view>
          <text class="cell-label">小车 IP</text>
        </view>
        <input v-model="ip" class="cell-input" placeholder="192.168.1.11" />
      </view>
      <view class="setting-cell">
        <view class="cell-left">
          <view class="cell-icon tcp">T</view>
          <text class="cell-label">TCP 端口</text>
        </view>
        <input v-model="port" class="cell-input" type="number" placeholder="6000" />
      </view>
      <view class="setting-cell last">
        <view class="cell-left">
          <view class="cell-icon video">V</view>
          <text class="cell-label">视频端口</text>
        </view>
        <input v-model="videoPort" class="cell-input" type="number" placeholder="6500" />
      </view>
    </view>

    <view class="action-row">
      <button class="primary-btn" hover-class="btn-press" @click="save">保存配置</button>
      <button class="secondary-btn" hover-class="btn-press" @click="testConnect">连接测试</button>
    </view>

    <view class="result-card">
      <view class="result-left">
        <text class="result-label">连接状态</text>
        <text :class="['result-value', connected ? 'online' : 'offline']">
          {{ resultText }}
        </text>
      </view>
      <view :class="['ui-badge', connected ? 'online' : 'offline']">
        <view class="ui-badge-dot"></view>
        <text>{{ connected ? '在线' : '离线' }}</text>
      </view>
    </view>

    <view class="ui-section">
      <text class="ui-section-title">关于</text>
    </view>

    <view class="about-card">
      <view class="about-row">
        <view class="about-left">
          <text class="about-icon">📱</text>
          <text class="about-label">应用版本</text>
        </view>
        <text class="about-value">v1.0.0</text>
      </view>
      <view class="about-row">
        <view class="about-left">
          <text class="about-icon">🔗</text>
          <text class="about-label">通信协议</text>
        </view>
        <text class="about-value">CarEncode TCP</text>
      </view>
      <view class="about-row last">
        <view class="about-left">
          <text class="about-icon">🚗</text>
          <text class="about-label">默认 IP</text>
        </view>
        <text class="about-value">192.168.1.11</text>
      </view>
    </view>

    <button class="logout-btn" hover-class="logout-hover" @click="handleLogout">
      <text class="logout-icon">⏻</text>
      <text>退出登录</text>
    </button>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getNetworkConfig, saveNetworkConfig, testConnect as apiTestConnect } from '@/api/patrol'
import { getProfile } from '@/api/auth'
import { clearAuth, getUser, requireLogin } from '@/utils/auth'

const profile = ref({ username: '', nickname: '' })
const ip = ref('192.168.1.11')
const port = ref('6000')
const videoPort = ref('6500')
const connected = ref(false)
const resultText = ref('未测试')

const avatarText = computed(() => {
  const name = profile.value.nickname || profile.value.username || 'U'
  return name.slice(0, 1).toUpperCase()
})

onShow(async () => {
  if (!requireLogin()) return

  const cached = getUser()
  if (cached) profile.value = cached

  try {
    profile.value = await getProfile()
  } catch {
    // 使用缓存
  }

  try {
    const res = await getNetworkConfig()
    ip.value = res.ip || ip.value
    port.value = String(res.port || port.value)
    videoPort.value = String(res.video_port || videoPort.value)
  } catch {
    // 使用默认值
  }
})

async function save() {
  try {
    await saveNetworkConfig({
      ip: ip.value,
      port: Number(port.value),
      video_port: Number(videoPort.value),
    })
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: error.message || '保存失败', icon: 'none' })
  }
}

async function testConnect() {
  try {
    await saveNetworkConfig({
      ip: ip.value,
      port: Number(port.value),
      video_port: Number(videoPort.value),
    })
    const res = await apiTestConnect()
    connected.value = !!res.connected
    resultText.value = res.message
    uni.showToast({
      title: res.connected ? '连接成功' : '连接失败',
      icon: res.connected ? 'success' : 'none',
    })
  } catch (error) {
    connected.value = false
    resultText.value = error.message || '连接失败'
    uni.showToast({ title: resultText.value, icon: 'none' })
  }
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '退出后需重新登录',
    success: (res) => {
      if (res.confirm) {
        clearAuth()
        uni.reLaunch({ url: '/pages/login/index' })
      }
    },
  })
}
</script>

<style lang="scss" scoped>
@import '../../uni.scss';

.page {
  @include page-wrap;
}

.profile-header {
  position: relative;
  margin-bottom: 32rpx;
  overflow: hidden;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  box-shadow: $shadow-primary;
}

.profile-bg {
  position: absolute;
  top: -50rpx;
  right: -30rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.profile-bg-2 {
  top: auto;
  right: auto;
  bottom: -60rpx;
  left: -40rpx;
  width: 140rpx;
  height: 140rpx;
  background: rgba(255, 255, 255, 0.06);
}

.profile-body {
  display: flex;
  align-items: center;
  padding: 48rpx $space-2xl;
}

.avatar {
  position: relative;
  @include flex-center;
  width: 120rpx;
  height: 120rpx;
  margin-right: $space-xl;
  font-size: 48rpx;
  font-weight: 700;
  color: $primary;
  background: $card-bg;
  border-radius: 50%;
  box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.15);
}

.avatar-ring {
  position: absolute;
  inset: -6rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.nickname {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-white;
}

.username {
  display: block;
  margin-top: 6rpx;
  font-size: 26rpx;
  color: $text-white-secondary;
  font-family: 'Courier New', monospace;
}

.role-tag {
  display: inline-block;
  margin-top: 12rpx;
  padding: 6rpx 16rpx;
  font-size: 20rpx;
  font-weight: 500;
  color: $text-white-secondary;
  @include glass-light;
  border-radius: $radius-round;
}

.settings-group {
  margin-bottom: $space-xl;
  @include card;
  overflow: hidden;
}

.setting-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #f0f2f5;
}

.setting-cell.last {
  border-bottom: none;
}

.cell-left {
  display: flex;
  align-items: center;
}

.cell-icon {
  @include flex-center;
  width: 48rpx;
  height: 48rpx;
  margin-right: $space-base;
  font-size: 20rpx;
  font-weight: 700;
  color: $text-white;
  border-radius: $radius-sm;
}

.cell-icon.ip { background: $gradient-primary; }
.cell-icon.tcp { background: $gradient-cyan; }
.cell-icon.video { background: $gradient-purple; }

.cell-label {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-secondary;
}

.cell-input {
  flex: 1;
  max-width: 320rpx;
  font-size: 30rpx;
  text-align: right;
  color: $text-primary;
  font-family: 'Courier New', monospace;
}

.action-row {
  display: flex;
  flex-direction: row;
  gap: $space-base;
  margin-bottom: $space-xl;
}

.primary-btn {
  @include btn-primary;
  flex: 1;
}

.secondary-btn {
  @include btn-success;
  flex: 1;
}

.btn-press {
  opacity: 0.88;
  transform: scale(0.98);
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  margin-bottom: $space-2xl;
  @include card;
}

.result-label {
  display: block;
  font-size: 24rpx;
  font-weight: 500;
  color: $text-secondary;
}

.result-value {
  display: block;
  margin-top: 6rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.result-value.online { color: $success; }
.result-value.offline { color: $text-tertiary; }

.about-card {
  padding: 8rpx 28rpx;
  margin-bottom: $space-2xl;
  @include card;
}

.about-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}

.about-row.last {
  border-bottom: none;
}

.about-left {
  display: flex;
  align-items: center;
}

.about-icon {
  margin-right: $space-base;
  font-size: 28rpx;
}

.about-label {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-secondary;
}

.about-value {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
  font-family: 'Courier New', monospace;
}

.logout-btn {
  @include flex-center;
  flex-direction: row;
  gap: 12rpx;
  width: 100%;
  height: 100rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $danger;
  background: $danger-light;
  border: 2rpx solid rgba(255, 77, 79, 0.15);
  border-radius: $radius-lg;
}

.logout-hover {
  background: #ffe7e6;
}

.logout-icon {
  font-size: 28rpx;
}
</style>

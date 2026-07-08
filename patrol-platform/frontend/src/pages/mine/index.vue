<template>
  <view class="page">
    <view class="profile-header">
      <view class="profile-bg"></view>
      <view class="profile-body">
        <view class="avatar">{{ avatarText }}</view>
        <view class="profile-info">
          <text class="nickname">{{ profile.nickname || profile.username }}</text>
          <text class="username">@{{ profile.username }}</text>
        </view>
      </view>
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">网络配置</text>
        <text class="ui-section-extra">TCP 通信</text>
      </view>
    </view>

    <view class="settings-group">
      <view class="setting-cell">
        <text class="cell-label">小车 IP</text>
        <input v-model="ip" class="cell-input" placeholder="192.168.1.11" />
      </view>
      <view class="setting-cell">
        <text class="cell-label">TCP 端口</text>
        <input v-model="port" class="cell-input" type="number" placeholder="6000" />
      </view>
      <view class="setting-cell last">
        <text class="cell-label">视频端口</text>
        <input v-model="videoPort" class="cell-input" type="number" placeholder="6500" />
      </view>
    </view>

    <view class="action-row">
      <button class="primary-btn" @click="save">保存配置</button>
      <button class="secondary-btn" @click="testConnect">连接测试</button>
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

    <view class="about-card">
      <view class="about-row">
        <text class="about-label">应用版本</text>
        <text class="about-value">v1.0.0</text>
      </view>
      <view class="about-row">
        <text class="about-label">通信协议</text>
        <text class="about-value">CarEncode TCP</text>
      </view>
    </view>

    <button class="logout-btn" @click="handleLogout">退出登录</button>
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
.page {
  @include page-wrap;
}

.profile-header {
  position: relative;
  margin-bottom: 28rpx;
  overflow: hidden;
  background: $gradient-primary;
  border-radius: $card-radius;
  box-shadow: $shadow-primary;
}

.profile-bg {
  position: absolute;
  top: -40rpx;
  right: -30rpx;
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.profile-body {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  margin-right: 24rpx;
  font-size: 44rpx;
  font-weight: 700;
  color: $primary;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.username {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.settings-group {
  margin-bottom: 24rpx;
  @include card;
  overflow: hidden;
}

.setting-cell {
  display: flex;
  align-items: center;
  padding: 28rpx 28rpx;
  border-bottom: 1rpx solid #f0f2f5;

  &.last {
    border-bottom: none;
  }
}

.cell-label {
  width: 160rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.cell-input {
  flex: 1;
  font-size: 30rpx;
  text-align: right;
  color: $text-primary;
}

.action-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 24rpx;
}

.primary-btn {
  @include btn-primary;
  flex: 1;
  margin-right: 16rpx;
}

.secondary-btn {
  @include btn-success;
  flex: 1;
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  margin-bottom: 24rpx;
  @include card;
}

.result-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}

.result-value {
  display: block;
  margin-top: 6rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.result-value.online {
  color: $success;
}

.result-value.offline {
  color: $text-tertiary;
}

.about-card {
  padding: 8rpx 28rpx;
  margin-bottom: 24rpx;
  @include card;
}

.about-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }
}

.about-label {
  font-size: 28rpx;
  color: $text-secondary;
}

.about-value {
  font-size: 28rpx;
  color: $text-primary;
}

.logout-btn {
  @include btn-base;
  width: 100%;
  color: $danger;
  background: $danger-light;
  border: 1rpx solid rgba(255, 77, 79, 0.15);
}
</style>

<template>
  <view class="page">
    <view class="page-header">
      <view class="header-text">
        <text class="header-title">远程控制</text>
        <text class="header-desc">实时操控巡检小车</text>
      </view>
      <view :class="['ui-badge', carConnected ? 'online' : 'offline']">
        <view class="ui-badge-dot"></view>
        <text>{{ carConnected ? '已连接' : '未连接' }}</text>
      </view>
    </view>

    <view class="mode-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.mode"
        :class="['mode-tab', ctrlMode === tab.mode ? 'active' : '']"
        @click="ctrlMode = tab.mode"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">{{ ctrlMode === CtrlMode.BUTTON ? '方向控制' : '摇杆控制' }}</text>
        <text v-if="ctrlMode === CtrlMode.ROCKER" class="ui-section-extra">{{ speedX }}, {{ speedY }}</text>
      </view>
    </view>

    <view class="control-card">
      <ButtonPad v-if="ctrlMode === CtrlMode.BUTTON" @command="handleButton" />
      <RockerPad v-else @move="handleRockerMove" @stop="handleRockerStop" />
    </view>

    <view class="ui-section">
      <text class="ui-section-title">视频监控</text>
      <text class="ui-section-desc">视频端口 {{ videoPort }}</text>
    </view>

    <view class="video-card">
      <view class="video-frame">
        <text class="video-placeholder">LIVE</text>
      </view>
      <text class="video-tip">预留区域 · 可接入 RTSP / WebRTC</text>
    </view>

    <view class="ui-section">
      <text class="ui-section-title">循迹模式</text>
      <text class="ui-section-desc">自动沿线路行驶</text>
    </view>

    <view class="action-row">
      <button class="track-btn start" hover-class="btn-hover" @click="startTracking">
        ▶ 开始循迹
      </button>
      <button class="track-btn stop" hover-class="btn-hover" @click="stopTracking">
        ■ 停止循迹
      </button>
    </view>

    <view class="status-card">
      <view class="status-row">
        <text class="status-label">指令反馈</text>
        <text class="status-time">实时</text>
      </view>
      <text class="status-value">{{ statusText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ButtonPad from '@/components/ButtonPad.vue'
import RockerPad from '@/components/RockerPad.vue'
import { CtrlMode } from '@/constants/car'
import {
  getDeviceStatus,
  sendButton,
  sendRocker,
  sendTracking,
} from '@/api/patrol'
import { requireLogin } from '@/utils/auth'

const tabs = [
  { mode: CtrlMode.BUTTON, label: '按钮', icon: '⊞' },
  { mode: CtrlMode.ROCKER, label: '摇杆', icon: '◎' },
]

const ctrlMode = ref(CtrlMode.BUTTON)
const statusText = ref('待命')
const videoPort = ref(6500)
const carConnected = ref(false)
const speedX = ref(0)
const speedY = ref(0)

async function handleButton(direction) {
  try {
    const res = await sendButton(direction)
    statusText.value = res.message
  } catch (error) {
    uni.showToast({ title: error.message || '控制失败', icon: 'none' })
  }
}

async function handleRockerMove({ speedX: x, speedY: y }) {
  speedX.value = x
  speedY.value = y
  try {
    const res = await sendRocker(x, y)
    statusText.value = res.message
  } catch {
    // 摇杆连续发送
  }
}

async function handleRockerStop() {
  speedX.value = 0
  speedY.value = 0
  try {
    const res = await sendRocker(0, 0)
    statusText.value = res.message
  } catch {
    statusText.value = '已停止'
  }
}

async function startTracking() {
  try {
    const res = await sendTracking('start')
    statusText.value = res.message
  } catch (error) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  }
}

async function stopTracking() {
  try {
    const res = await sendTracking('stop')
    statusText.value = res.message
  } catch (error) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  }
}

function refreshStatus() {
  getDeviceStatus()
    .then((res) => {
      carConnected.value = !!res.connected
      statusText.value = res.connected ? '已连接小车' : '未连接小车'
      videoPort.value = res.video_port || 6500
    })
    .catch(() => {})
}

refreshStatus()

onShow(() => {
  if (!requireLogin()) return
  refreshStatus()
})
</script>

<style lang="scss" scoped>
.page {
  @include page-wrap;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.header-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}

.header-desc {
  display: block;
  margin-top: 4rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.mode-tabs {
  display: flex;
  flex-direction: row;
  padding: 6rpx;
  margin-bottom: 8rpx;
  background: #e4e9f2;
  border-radius: 20rpx;
}

.mode-tab {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  border-radius: 16rpx;
}

.mode-tab.active {
  background: #fff;
  box-shadow: $shadow-sm;
}

.tab-icon {
  margin-right: 8rpx;
  font-size: 28rpx;
  color: $text-tertiary;
}

.mode-tab.active .tab-icon,
.mode-tab.active .tab-label {
  color: $primary;
}

.tab-label {
  font-size: 28rpx;
  color: $text-secondary;
}

.mode-tab.active .tab-label {
  font-weight: 600;
}

.control-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36rpx 20rpx;
  margin-bottom: 8rpx;
  @include card;
}

.video-card {
  padding: 24rpx;
  margin-bottom: 8rpx;
  @include card;
}

.video-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200rpx;
  background: linear-gradient(145deg, #1a1f2e 0%, #2d3548 100%);
  border-radius: 16rpx;
}

.video-placeholder {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  border-radius: 8rpx;
}

.video-tip {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  text-align: center;
  color: $text-tertiary;
}

.action-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8rpx;
}

.track-btn {
  flex: 1;
  height: 92rpx;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: $input-radius;
  border: none;

  &::after {
    border: none;
  }
}

.track-btn.start {
  margin-right: 16rpx;
  color: #fff;
  background: $gradient-primary;
  box-shadow: 0 8rpx 20rpx rgba(22, 119, 255, 0.25);
}

.track-btn.stop {
  color: #fff;
  background: linear-gradient(135deg, #ffa940, #fa8c16);
  box-shadow: 0 8rpx 20rpx rgba(250, 140, 22, 0.25);
}

.btn-hover {
  opacity: 0.85;
}

.status-card {
  padding: 28rpx 32rpx;
  margin-top: 8rpx;
  @include card;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-label {
  font-size: 24rpx;
  color: $text-secondary;
}

.status-time {
  font-size: 22rpx;
  color: $success;
}

.status-value {
  display: block;
  margin-top: 10rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}
</style>

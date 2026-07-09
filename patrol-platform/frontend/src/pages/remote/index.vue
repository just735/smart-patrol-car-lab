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

    <view v-if="!carConnected" class="ui-banner warn">
      <text class="ui-banner-icon">⚠</text>
      <text>小车未连接，请先在「我的」配置网络并测试连接</text>
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
      <view class="tab-indicator" :class="ctrlMode === CtrlMode.ROCKER ? 'right' : 'left'"></view>
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">{{ ctrlMode === CtrlMode.BUTTON ? '方向控制' : '摇杆控制' }}</text>
        <text v-if="ctrlMode === CtrlMode.ROCKER" class="speed-tag">{{ speedX }}, {{ speedY }}</text>
      </view>
      <text class="ui-section-desc">
        {{ ctrlMode === CtrlMode.BUTTON ? '按住方向键移动，松开自动停止' : '拖动摇杆控制速度与方向' }}
      </text>
    </view>

    <view class="control-card">
      <ButtonPad v-if="ctrlMode === CtrlMode.BUTTON" @command="handleButton" />
      <RockerPad v-else @move="handleRockerMove" @stop="handleRockerStop" />
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">视频监控</text>
        <text class="ui-section-extra">端口 {{ videoPort }}</text>
      </view>
    </view>

    <view class="video-card">
      <view class="video-frame">
        <view class="video-scanline"></view>
        <view class="video-corner tl"></view>
        <view class="video-corner tr"></view>
        <view class="video-corner bl"></view>
        <view class="video-corner br"></view>
        <view class="video-center">
          <text class="video-camera">📷</text>
          <text class="video-placeholder">LIVE</text>
        </view>
      </view>
      <view class="video-meta">
        <text class="video-tip">预留区域 · 可接入 RTSP / WebRTC 视频流</text>
        <view class="video-status">
          <view class="rec-dot"></view>
          <text>待接入</text>
        </view>
      </view>
    </view>

    <view class="ui-section">
      <text class="ui-section-title">循迹模式</text>
      <text class="ui-section-desc">自动沿预设线路行驶</text>
    </view>

    <view class="action-row">
      <button class="track-btn start" hover-class="btn-press" @click="startTracking">
        <text class="btn-icon">▶</text>
        <text>开始循迹</text>
      </button>
      <button class="track-btn stop" hover-class="btn-press" @click="stopTracking">
        <text class="btn-icon">■</text>
        <text>停止循迹</text>
      </button>
    </view>

    <view class="status-card">
      <view class="status-row">
        <view class="status-left">
          <text class="status-dot-icon">◉</text>
          <text class="status-label">指令反馈</text>
        </view>
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
@import '../../uni.scss';

.page {
  @include page-wrap;
}

.page-header {
  @include page-header;
}

.header-title {
  @include page-title;
}

.header-desc {
  @include page-subtitle;
}

.mode-tabs {
  position: relative;
  @include segment-control;
  margin-bottom: $space-xl;
}

.mode-tab {
  @include segment-item;
  position: relative;
  z-index: 1;
  flex-direction: row;
  padding: 22rpx 0;
}

.mode-tab.active {
  @include segment-item-active;
  background: transparent;
  box-shadow: none;
}

.tab-indicator {
  position: absolute;
  top: 6rpx;
  bottom: 6rpx;
  width: calc(50% - 6rpx);
  background: $card-bg;
  border-radius: $radius-sm;
  box-shadow: $shadow-xs;
  @include transition-fast;
}

.tab-indicator.left { left: 6rpx; }
.tab-indicator.right { left: calc(50%); }

.tab-icon {
  margin-right: $space-xs;
  font-size: 28rpx;
  color: $text-tertiary;
}

.mode-tab.active .tab-icon,
.mode-tab.active .tab-label {
  color: $primary;
}

.tab-label {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-secondary;
}

.mode-tab.active .tab-label {
  font-weight: 600;
}

.speed-tag {
  padding: 6rpx 16rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $primary;
  background: $primary-lighter;
  border-radius: $radius-round;
  font-family: 'Courier New', monospace;
}

.control-card {
  @include flex-center;
  padding: 48rpx $space-lg;
  margin-bottom: $space-xl;
  min-height: 420rpx;
  @include card;
  background: linear-gradient(180deg, $card-bg 0%, #f8fafd 100%);
}

.video-card {
  padding: $space-xl;
  margin-bottom: $space-xl;
  @include card;
}

.video-frame {
  position: relative;
  @include flex-center;
  height: 260rpx;
  background: linear-gradient(145deg, #141820 0%, #1e2433 50%, #2a3142 100%);
  border-radius: $radius-lg;
  overflow: hidden;
}

.video-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3rpx,
    rgba(255, 255, 255, 0.02) 3rpx,
    rgba(255, 255, 255, 0.02) 6rpx
  );
  pointer-events: none;
}

.video-corner {
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  border-color: rgba(22, 119, 255, 0.6);
  border-style: solid;
}

.video-corner.tl { top: 16rpx; left: 16rpx; border-width: 3rpx 0 0 3rpx; }
.video-corner.tr { top: 16rpx; right: 16rpx; border-width: 3rpx 3rpx 0 0; }
.video-corner.bl { bottom: 16rpx; left: 16rpx; border-width: 0 0 3rpx 3rpx; }
.video-corner.br { bottom: 16rpx; right: 16rpx; border-width: 0 3rpx 3rpx 0; }

.video-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-camera {
  font-size: 48rpx;
  opacity: 0.5;
  margin-bottom: 12rpx;
}

.video-placeholder {
  padding: 8rpx 28rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 8rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-sm;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-base;
}

.video-tip {
  flex: 1;
  font-size: 24rpx;
  color: $text-tertiary;
}

.video-status {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: $text-tertiary;
}

.rec-dot {
  width: 10rpx;
  height: 10rpx;
  margin-right: 8rpx;
  background: $text-quaternary;
  border-radius: 50%;
}

.action-row {
  display: flex;
  flex-direction: row;
  gap: $space-base;
  margin-bottom: $space-xl;
}

.track-btn {
  @include flex-center;
  flex: 1;
  flex-direction: row;
  height: 100rpx;
  gap: 10rpx;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: $radius-lg;
  border: none;
}

.btn-icon {
  font-size: 24rpx;
}

.track-btn.start {
  color: $text-white;
  background: $gradient-primary;
  box-shadow: $shadow-primary;
}

.track-btn.stop {
  color: $text-white;
  background: $gradient-orange;
  box-shadow: 0 8rpx 24rpx rgba(250, 140, 22, 0.28);
}

.btn-press {
  opacity: 0.88;
  transform: scale(0.98);
}

.status-card {
  padding: 32rpx;
  @include card;
  background: linear-gradient(135deg, #fafbfd 0%, $card-bg 100%);
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-sm;
}

.status-left {
  display: flex;
  align-items: center;
}

.status-dot-icon {
  margin-right: 8rpx;
  font-size: 20rpx;
  color: $success;
}

.status-label {
  font-size: 24rpx;
  font-weight: 500;
  color: $text-secondary;
}

.status-time {
  font-size: 22rpx;
  font-weight: 500;
  color: $success;
  padding: 6rpx 14rpx;
  background: $success-light;
  border-radius: $radius-round;
}

.status-value {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
}
</style>

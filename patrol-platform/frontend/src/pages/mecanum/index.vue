<template>
  <view class="page">
    <view class="header-card">
      <view class="header-icon">⚙</view>
      <view class="header-text">
        <text class="title">麦克纳姆轮</text>
        <text class="desc">四轮独立速度 · 全向移动</text>
      </view>
      <view class="header-badge">4WD</view>
    </view>

    <view class="car-visual">
      <view class="car-shadow"></view>
      <view class="car-body">
        <view class="car-front"></view>
        <text class="car-label">PATROL</text>
        <view class="wheel-dot tl" :style="wheelStyle.l1">
          <text class="wheel-speed">{{ values.l1 }}</text>
        </view>
        <view class="wheel-dot tr" :style="wheelStyle.r1">
          <text class="wheel-speed">{{ values.r1 }}</text>
        </view>
        <view class="wheel-dot bl" :style="wheelStyle.l2">
          <text class="wheel-speed">{{ values.l2 }}</text>
        </view>
        <view class="wheel-dot br" :style="wheelStyle.r2">
          <text class="wheel-speed">{{ values.r2 }}</text>
        </view>
      </view>
    </view>

    <view class="ui-section">
      <text class="ui-section-title">快捷预设</text>
      <text class="ui-section-desc">一键设置四轮速度组合</text>
    </view>

    <view class="preset-row">
      <view
        v-for="p in presets"
        :key="p.key"
        class="preset-chip"
        hover-class="preset-hover"
        @click="applyPreset(p)"
      >
        <text class="preset-arrow">{{ p.arrow }}</text>
        <text>{{ p.label }}</text>
      </view>
    </view>

    <view class="wheel-grid">
      <view
        v-for="wheel in wheels"
        :key="wheel.key"
        class="wheel-card"
      >
        <view class="wheel-head">
          <view class="wheel-info">
            <view class="wheel-dot-mini" :style="{ background: wheel.color }"></view>
            <text class="wheel-name">{{ wheel.label }}</text>
          </view>
          <text class="wheel-value" :style="{ color: wheel.color }">{{ values[wheel.key] }}</text>
        </view>
        <view class="wheel-bar">
          <view
            class="wheel-bar-fill"
            :style="{
              width: Math.abs(values[wheel.key]) + '%',
              background: wheel.color,
              marginLeft: values[wheel.key] < 0 ? (100 - Math.abs(values[wheel.key])) + '%' : '50%',
            }"
          ></view>
        </view>
        <slider
          :value="values[wheel.key]"
          min="-100"
          max="100"
          block-size="20"
          :activeColor="wheel.color"
          backgroundColor="#e8ecf2"
          @change="(e) => onChange(wheel.key, e.detail.value)"
        />
      </view>
    </view>

    <view class="action-row">
      <button class="send-btn" hover-class="btn-press" @click="sendSpeed">
        <text class="btn-icon">▶</text>
        <text>发送速度</text>
      </button>
      <button class="reset-btn" hover-class="btn-press" @click="resetAll">
        <text class="btn-icon">↺</text>
        <text>归零</text>
      </button>
    </view>

    <view class="status-card">
      <view class="status-row">
        <text class="status-label">发送状态</text>
        <text class="status-tag">Mecanum</text>
      </view>
      <text class="status-value">{{ statusText }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { sendMecanum } from '@/api/patrol'
import { requireLogin } from '@/utils/auth'

const wheels = [
  { key: 'l1', label: '左前 L1', color: '#1677ff' },
  { key: 'r1', label: '右前 R1', color: '#722ed1' },
  { key: 'l2', label: '左后 L2', color: '#13c2c2' },
  { key: 'r2', label: '右后 R2', color: '#fa8c16' },
]

const presets = [
  { key: 'fwd', label: '前进', arrow: '↑', values: { l1: 60, l2: 60, r1: 60, r2: 60 } },
  { key: 'back', label: '后退', arrow: '↓', values: { l1: -60, l2: -60, r1: -60, r2: -60 } },
  { key: 'left', label: '左移', arrow: '←', values: { l1: -50, l2: 50, r1: 50, r2: -50 } },
  { key: 'right', label: '右移', arrow: '→', values: { l1: 50, l2: -50, r1: -50, r2: 50 } },
]

const values = reactive({ l1: 0, l2: 0, r1: 0, r2: 0 })
const statusText = ref('待发送')

const wheelStyle = computed(() => {
  const make = (v, color) => ({
    opacity: 0.35 + Math.abs(v) / 100 * 0.65,
    background: color,
    transform: `scale(${0.85 + Math.abs(v) / 100 * 0.15})`,
  })
  return {
    l1: make(values.l1, '#1677ff'),
    r1: make(values.r1, '#722ed1'),
    l2: make(values.l2, '#13c2c2'),
    r2: make(values.r2, '#fa8c16'),
  }
})

function onChange(key, value) {
  values[key] = value
}

function applyPreset(p) {
  Object.assign(values, p.values)
  statusText.value = `已应用：${p.label}`
}

async function sendSpeed() {
  try {
    const res = await sendMecanum(values.l1, values.l2, values.r1, values.r2)
    statusText.value = res.message
  } catch (error) {
    uni.showToast({ title: error.message || '发送失败', icon: 'none' })
  }
}

function resetAll() {
  values.l1 = 0
  values.l2 = 0
  values.r1 = 0
  values.r2 = 0
  statusText.value = '已归零'
}

onShow(() => {
  requireLogin()
})
</script>

<style lang="scss" scoped>
@import '../../uni.scss';

.page {
  @include page-wrap;
}

.header-card {
  display: flex;
  align-items: center;
  padding: 36rpx 32rpx;
  margin-bottom: $space-lg;
  background: $gradient-purple;
  border-radius: $radius-2xl;
  box-shadow: $shadow-purple;
}

.header-icon {
  @include flex-center;
  width: 80rpx;
  height: 80rpx;
  margin-right: $space-lg;
  font-size: 40rpx;
  @include glass-light;
  border-radius: $radius-lg;
}

.header-text {
  flex: 1;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-white;
}

.desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $text-white-secondary;
}

.header-badge {
  padding: 8rpx 18rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: $text-white;
  letter-spacing: 2rpx;
  @include glass-light;
  border-radius: $radius-round;
}

.car-visual {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: $space-xl;
  padding: $space-xl 0 $space-lg;
}

.car-shadow {
  position: absolute;
  bottom: 0;
  width: 260rpx;
  height: 24rpx;
  background: radial-gradient(ellipse, rgba(31, 35, 41, 0.12) 0%, transparent 70%);
  border-radius: 50%;
}

.car-body {
  position: relative;
  width: 280rpx;
  height: 360rpx;
  background: linear-gradient(180deg, #fafbfc 0%, #eef1f6 100%);
  border: 3rpx solid #d5dae3;
  border-radius: 48rpx 48rpx 32rpx 32rpx;
  box-shadow: $shadow-base, inset 0 2rpx 12rpx rgba(255, 255, 255, 0.9);
}

.car-front {
  position: absolute;
  top: 16rpx;
  left: 50%;
  width: 120rpx;
  height: 8rpx;
  margin-left: -60rpx;
  background: $gradient-primary;
  border-radius: 4rpx;
  opacity: 0.6;
}

.car-label {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 18rpx;
  font-weight: 700;
  color: $text-quaternary;
  letter-spacing: 4rpx;
  transform: translate(-50%, -50%);
}

.wheel-dot {
  position: absolute;
  @include flex-center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  @include transition-base;
}

.wheel-speed {
  font-size: 16rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.wheel-dot.tl { top: 24rpx; left: 24rpx; }
.wheel-dot.tr { top: 24rpx; right: 24rpx; }
.wheel-dot.bl { bottom: 24rpx; left: 24rpx; }
.wheel-dot.br { bottom: 24rpx; right: 24rpx; }

.preset-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-bottom: $space-xl;
}

.preset-chip {
  @include chip;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  color: $primary;
  background: $primary-lighter;
  border: 1rpx solid rgba(22, 119, 255, 0.12);
}

.preset-hover {
  background: $primary-light;
  transform: scale(0.96);
}

.preset-arrow {
  font-size: 28rpx;
  font-weight: 700;
}

.wheel-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: $space-base;
  margin-bottom: $space-base;
}

.wheel-card {
  width: calc(50% - 8rpx);
  padding: 24rpx 20rpx 16rpx;
  box-sizing: border-box;
  @include card;
}

.wheel-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.wheel-info {
  display: flex;
  align-items: center;
}

.wheel-dot-mini {
  width: 12rpx;
  height: 12rpx;
  margin-right: 10rpx;
  border-radius: 50%;
}

.wheel-name {
  font-size: 24rpx;
  font-weight: 600;
  color: $text-primary;
}

.wheel-value {
  font-size: 32rpx;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.wheel-bar {
  position: relative;
  height: 6rpx;
  margin-bottom: 8rpx;
  background: #eef1f6;
  border-radius: 3rpx;
  overflow: hidden;
}

.wheel-bar-fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 3rpx;
  @include transition-fast;
}

.action-row {
  display: flex;
  flex-direction: row;
  gap: $space-base;
  margin-top: $space-base;
}

.send-btn,
.reset-btn {
  @include flex-center;
  flex: 1;
  flex-direction: row;
  gap: 10rpx;
}

.send-btn {
  @include btn-primary;
}

.reset-btn {
  @include btn-ghost;
}

.btn-icon {
  font-size: 26rpx;
}

.btn-press {
  opacity: 0.88;
  transform: scale(0.98);
}

.status-card {
  padding: 32rpx;
  margin-top: $space-lg;
  @include card;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-sm;
}

.status-label {
  font-size: 24rpx;
  font-weight: 500;
  color: $text-secondary;
}

.status-tag {
  padding: 4rpx 14rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: $purple;
  background: $purple-light;
  border-radius: $radius-round;
}

.status-value {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
}
</style>

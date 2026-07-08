<template>
  <view class="page">
    <view class="header-card">
      <view class="header-icon">⚙</view>
      <view class="header-text">
        <text class="title">麦克纳姆轮</text>
        <text class="desc">四轮独立速度控制</text>
      </view>
    </view>

    <view class="car-visual">
      <view class="car-body">
        <text class="car-label">PATROL CAR</text>
        <view class="wheel-dot tl" :style="{ opacity: wheelOpacity.l1 }"></view>
        <view class="wheel-dot tr" :style="{ opacity: wheelOpacity.r1 }"></view>
        <view class="wheel-dot bl" :style="{ opacity: wheelOpacity.l2 }"></view>
        <view class="wheel-dot br" :style="{ opacity: wheelOpacity.r2 }"></view>
      </view>
    </view>

    <view class="preset-row">
      <view
        v-for="p in presets"
        :key="p.key"
        class="preset-chip"
        hover-class="preset-hover"
        @click="applyPreset(p)"
      >
        {{ p.label }}
      </view>
    </view>

    <view class="wheel-grid">
      <view
        v-for="wheel in wheels"
        :key="wheel.key"
        class="wheel-card"
      >
        <view class="wheel-head">
          <text class="wheel-name">{{ wheel.label }}</text>
          <text class="wheel-value" :style="{ color: wheel.color }">{{ values[wheel.key] }}</text>
        </view>
        <slider
          :value="values[wheel.key]"
          min="-100"
          max="100"
          block-size="22"
          :activeColor="wheel.color"
          backgroundColor="#e8ecf2"
          @change="(e) => onChange(wheel.key, e.detail.value)"
        />
      </view>
    </view>

    <view class="action-row">
      <button class="send-btn" @click="sendSpeed">发送速度</button>
      <button class="reset-btn" @click="resetAll">归零</button>
    </view>

    <view class="status-card">
      <text class="status-label">发送状态</text>
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
  { key: 'fwd', label: '前进', values: { l1: 60, l2: 60, r1: 60, r2: 60 } },
  { key: 'back', label: '后退', values: { l1: -60, l2: -60, r1: -60, r2: -60 } },
  { key: 'left', label: '左移', values: { l1: -50, l2: 50, r1: 50, r2: -50 } },
  { key: 'right', label: '右移', values: { l1: 50, l2: -50, r1: -50, r2: 50 } },
]

const values = reactive({ l1: 0, l2: 0, r1: 0, r2: 0 })
const statusText = ref('待发送')

const wheelOpacity = computed(() => ({
  l1: 0.3 + Math.abs(values.l1) / 100 * 0.7,
  l2: 0.3 + Math.abs(values.l2) / 100 * 0.7,
  r1: 0.3 + Math.abs(values.r1) / 100 * 0.7,
  r2: 0.3 + Math.abs(values.r2) / 100 * 0.7,
}))

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
.page {
  @include page-wrap;
}

.header-card {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  margin-bottom: 20rpx;
  background: $gradient-purple;
  border-radius: $card-radius;
  box-shadow: $shadow-purple;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  margin-right: 20rpx;
  font-size: 36rpx;
  @include glass-light;
  border-radius: 18rpx;
}

.header-text {
  flex: 1;
}

.title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.car-visual {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}

.car-body {
  position: relative;
  width: 280rpx;
  height: 360rpx;
  background: linear-gradient(180deg, #f0f3f8, #e4e9f2);
  border: 2rpx solid #d9dde5;
  border-radius: 40rpx 40rpx 24rpx 24rpx;
}

.car-label {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20rpx;
  font-weight: 700;
  color: $text-tertiary;
  letter-spacing: 2rpx;
  transform: translate(-50%, -50%);
}

.wheel-dot {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  background: $primary;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(22, 119, 255, 0.35);
}

.wheel-dot.tl { top: 24rpx; left: 24rpx; }
.wheel-dot.tr { top: 24rpx; right: 24rpx; background: $purple; }
.wheel-dot.bl { bottom: 24rpx; left: 24rpx; background: $cyan; }
.wheel-dot.br { bottom: 24rpx; right: 24rpx; background: $warning; }

.preset-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.preset-chip {
  padding: 14rpx 28rpx;
  margin-right: 16rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: $primary;
  background: $primary-light;
  border-radius: 999rpx;
}

.preset-hover {
  opacity: 0.8;
}

.wheel-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.wheel-card {
  width: 48%;
  padding: 22rpx 18rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
  @include card;

  &:nth-child(odd) {
    margin-right: 4%;
  }
}

.wheel-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rpx;
}

.wheel-name {
  font-size: 24rpx;
  font-weight: 500;
  color: $text-primary;
}

.wheel-value {
  font-size: 30rpx;
  font-weight: 700;
}

.action-row {
  display: flex;
  flex-direction: row;
  margin-top: 8rpx;
}

.send-btn {
  @include btn-primary;
  flex: 1;
  margin-right: 16rpx;
}

.reset-btn {
  @include btn-ghost;
  flex: 1;
}

.status-card {
  padding: 28rpx 32rpx;
  margin-top: 20rpx;
  @include card;
}

.status-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}

.status-value {
  display: block;
  margin-top: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: $text-primary;
}
</style>

<template>
  <view
    class="rocker-wrap"
    @touchstart.stop.prevent="onTouch"
    @touchmove.stop.prevent="onTouch"
    @touchend.stop.prevent="onEnd"
    @touchcancel.stop.prevent="onEnd"
  >
    <view class="rocker-base">
      <view class="guide guide-h"></view>
      <view class="guide guide-v"></view>
      <view class="guide-ring guide-ring-1"></view>
      <view class="guide-ring guide-ring-2"></view>
      <view class="dir dir-t">前</view>
      <view class="dir dir-b">后</view>
      <view class="dir dir-l">左</view>
      <view class="dir dir-r">右</view>
      <view class="rocker-stick" :class="{ active: isActive }" :style="stickStyle">
        <view class="stick-glow"></view>
        <view class="stick-inner"></view>
      </view>
    </view>
    <view class="speed-display">
      <view class="speed-block">
        <text class="speed-label">X</text>
        <text class="speed-item">{{ speedX }}</text>
      </view>
      <view class="speed-divider"></view>
      <view class="speed-block">
        <text class="speed-label">Y</text>
        <text class="speed-item">{{ speedY }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'

const emit = defineEmits(['move', 'stop'])

const maxOffset = 160
const offsetX = ref(0)
const offsetY = ref(0)
const speedX = ref(0)
const speedY = ref(0)
const isActive = ref(false)
const baseRect = ref(null)
const instance = getCurrentInstance()

const stickStyle = computed(() => ({
  transform: `translate(${offsetX.value}rpx, ${offsetY.value}rpx)`,
}))

onMounted(() => {
  uni.createSelectorQuery()
    .in(instance?.proxy)
    .select('.rocker-base')
    .boundingClientRect((rect) => {
      baseRect.value = rect
    })
    .exec()
})

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function onTouch(event) {
  const touch = event.touches?.[0]
  if (!touch || !baseRect.value) return

  isActive.value = true
  const rect = baseRect.value
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = touch.clientX - centerX
  const dy = touch.clientY - centerY
  const scale = maxOffset / (rect.width / 2)

  offsetX.value = clamp(dx * scale, -maxOffset, maxOffset)
  offsetY.value = clamp(dy * scale, -maxOffset, maxOffset)
  speedX.value = Math.round((offsetX.value / maxOffset) * 100)
  speedY.value = Math.round((-offsetY.value / maxOffset) * 100)

  emit('move', { speedX: speedX.value, speedY: speedY.value })
}

function onEnd() {
  isActive.value = false
  offsetX.value = 0
  offsetY.value = 0
  speedX.value = 0
  speedY.value = 0
  emit('stop')
}
</script>

<style lang="scss" scoped>
@import '../uni.scss';

.rocker-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rocker-base {
  position: relative;
  width: 480rpx;
  height: 480rpx;
  background: radial-gradient(circle at 50% 45%, #fafbfc 0%, #e8ecf2 100%);
  border-radius: 50%;
  box-shadow:
    inset 0 8rpx 24rpx rgba(31, 35, 41, 0.06),
    0 8rpx 32rpx rgba(31, 35, 41, 0.08);
}

.guide {
  position: absolute;
  background: #d0d7e2;
}

.guide-h {
  top: 50%;
  left: 10%;
  width: 80%;
  height: 2rpx;
  margin-top: -1rpx;
}

.guide-v {
  top: 10%;
  left: 50%;
  width: 2rpx;
  height: 80%;
  margin-left: -1rpx;
}

.guide-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.guide-ring-1 {
  width: 320rpx;
  height: 320rpx;
  border: 2rpx dashed #c8cfd8;
}

.guide-ring-2 {
  width: 200rpx;
  height: 200rpx;
  border: 1rpx solid #dde3eb;
}

.dir {
  position: absolute;
  font-size: 22rpx;
  font-weight: 600;
  color: $text-tertiary;
}

.dir-t { top: 28rpx; left: 50%; transform: translateX(-50%); }
.dir-b { bottom: 28rpx; left: 50%; transform: translateX(-50%); }
.dir-l { left: 28rpx; top: 50%; transform: translateY(-50%); }
.dir-r { right: 28rpx; top: 50%; transform: translateY(-50%); }

.rocker-stick {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 112rpx;
  height: 112rpx;
  margin-top: -56rpx;
  margin-left: -56rpx;
  background: $gradient-primary;
  border-radius: 50%;
  box-shadow: 0 10rpx 28rpx rgba(22, 119, 255, 0.4);
  @include transition-fast;
}

.rocker-stick.active {
  box-shadow: 0 14rpx 36rpx rgba(22, 119, 255, 0.55);
  transform-origin: center;
}

.stick-glow {
  position: absolute;
  inset: -8rpx;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.15);
}

.stick-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44rpx;
  height: 44rpx;
  margin-top: -22rpx;
  margin-left: -22rpx;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: inset 0 2rpx 6rpx rgba(255, 255, 255, 0.5);
}

.speed-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 28rpx;
  padding: 16rpx 40rpx;
  background: $card-bg;
  border: 1rpx solid $border-light;
  border-radius: $radius-round;
  box-shadow: $shadow-xs;
}

.speed-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80rpx;
}

.speed-label {
  font-size: 20rpx;
  font-weight: 500;
  color: $text-tertiary;
}

.speed-item {
  font-size: 32rpx;
  font-weight: 700;
  color: $primary;
  font-family: 'Courier New', monospace;
}

.speed-divider {
  width: 2rpx;
  height: 48rpx;
  margin: 0 28rpx;
  background: $border-light;
}
</style>

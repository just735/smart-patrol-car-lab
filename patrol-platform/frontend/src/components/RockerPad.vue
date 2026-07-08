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
      <view class="dir dir-t">前</view>
      <view class="dir dir-b">后</view>
      <view class="dir dir-l">左</view>
      <view class="dir dir-r">右</view>
      <view class="rocker-ring"></view>
      <view class="rocker-stick" :style="stickStyle">
        <view class="stick-inner"></view>
      </view>
    </view>
    <view class="speed-display">
      <text class="speed-item">X: {{ speedX }}</text>
      <text class="speed-divider">|</text>
      <text class="speed-item">Y: {{ speedY }}</text>
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
  offsetX.value = 0
  offsetY.value = 0
  speedX.value = 0
  speedY.value = 0
  emit('stop')
}
</script>

<style lang="scss" scoped>
.rocker-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rocker-base {
  position: relative;
  width: 460rpx;
  height: 460rpx;
  background: radial-gradient(circle at 50% 45%, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 50%;
  box-shadow: inset 0 6rpx 20rpx rgba(0, 0, 0, 0.06), 0 8rpx 32rpx rgba(31, 35, 41, 0.06);
}

.guide {
  position: absolute;
  background: #d5dbe5;
}

.guide-h {
  top: 50%;
  left: 12%;
  width: 76%;
  height: 2rpx;
  margin-top: -1rpx;
}

.guide-v {
  top: 12%;
  left: 50%;
  width: 2rpx;
  height: 76%;
  margin-left: -1rpx;
}

.dir {
  position: absolute;
  font-size: 22rpx;
  font-weight: 500;
  color: $text-tertiary;
}

.dir-t { top: 24rpx; left: 50%; transform: translateX(-50%); }
.dir-b { bottom: 24rpx; left: 50%; transform: translateX(-50%); }
.dir-l { left: 24rpx; top: 50%; transform: translateY(-50%); }
.dir-r { right: 24rpx; top: 50%; transform: translateY(-50%); }

.rocker-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300rpx;
  height: 300rpx;
  margin-top: -150rpx;
  margin-left: -150rpx;
  border: 2rpx dashed #c5cad3;
  border-radius: 50%;
}

.rocker-stick {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 108rpx;
  height: 108rpx;
  margin-top: -54rpx;
  margin-left: -54rpx;
  background: $gradient-primary;
  border-radius: 50%;
  box-shadow: 0 10rpx 28rpx rgba(22, 119, 255, 0.45);
}

.stick-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40rpx;
  height: 40rpx;
  margin-top: -20rpx;
  margin-left: -20rpx;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
}

.speed-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24rpx;
  padding: 12rpx 32rpx;
  background: #f0f3f8;
  border-radius: 999rpx;
}

.speed-item {
  font-size: 26rpx;
  font-weight: 600;
  color: $primary;
  font-variant-numeric: tabular-nums;
}

.speed-divider {
  margin: 0 16rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>

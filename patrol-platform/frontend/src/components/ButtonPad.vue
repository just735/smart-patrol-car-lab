<template>
  <view class="pad-wrap">
    <view class="grid">
      <button
        v-for="item in buttons"
        :key="item.key"
        :class="['cell', item.type, { empty: !item.label, active: activeKey === item.key }]"
        :disabled="!item.label"
        hover-class="cell-active"
        @touchstart.stop.prevent="onPress(item)"
        @touchend.stop.prevent="onRelease"
        @touchcancel.stop.prevent="onRelease"
      >
        <text v-if="item.arrow" class="cell-arrow">{{ item.arrow }}</text>
        <text class="cell-text">{{ item.label }}</text>
      </button>
    </view>
    <text class="pad-hint">按住方向键控制 · 松开自动停止</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { CarDirection } from '@/constants/car'

const emit = defineEmits(['command'])
const activeKey = ref('')

const buttons = [
  { key: 'lr', label: '左转', arrow: '↺', direction: CarDirection.LEFT_ROTATE, type: 'rotate' },
  { key: 'f', label: '前', arrow: '↑', direction: CarDirection.FRONT, type: 'move' },
  { key: 'rr', label: '右转', arrow: '↻', direction: CarDirection.RIGHT_ROTATE, type: 'rotate' },
  { key: 'l', label: '左', arrow: '←', direction: CarDirection.LEFT, type: 'move' },
  { key: 'b', label: '停', arrow: '■', direction: CarDirection.BRAKE, type: 'brake' },
  { key: 'r', label: '右', arrow: '→', direction: CarDirection.RIGHT, type: 'move' },
  { key: 'e1', label: '', direction: null, type: 'empty' },
  { key: 'a', label: '后', arrow: '↓', direction: CarDirection.AFTER, type: 'move' },
  { key: 'e2', label: '', direction: null, type: 'empty' },
]

function onPress(item) {
  if (!item.direction && item.direction !== 0) return
  activeKey.value = item.key
  emit('command', item.direction)
}

function onRelease() {
  activeKey.value = ''
  emit('command', CarDirection.STOP)
}
</script>

<style lang="scss" scoped>
@import '../uni.scss';

.pad-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 540rpx;
  height: 540rpx;
  padding: 12rpx;
  background: linear-gradient(145deg, #eef1f6 0%, #e4e9f0 100%);
  border-radius: 32rpx;
  box-shadow: inset 0 2rpx 8rpx rgba(31, 35, 41, 0.06);
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 6rpx;
  padding: 0;
  border-radius: 22rpx;
  border: none;
  box-shadow: 0 6rpx 16rpx rgba(31, 35, 41, 0.12);
  @include transition-fast;

  &::after {
    border: none;
  }
}

.cell-arrow {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
}

.cell-text {
  margin-top: 6rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.cell.move {
  background: $gradient-primary;
}

.cell.rotate {
  background: linear-gradient(145deg, #597ef7, #2f54eb);
}

.cell.brake {
  background: linear-gradient(145deg, #ff7875, #ff4d4f);
  box-shadow: 0 6rpx 20rpx rgba(255, 77, 79, 0.35);
}

.cell.empty {
  visibility: hidden;
  box-shadow: none;
}

.cell.active,
.cell-active {
  opacity: 0.85;
  transform: scale(0.92);
  box-shadow: 0 2rpx 8rpx rgba(31, 35, 41, 0.15);
}

.pad-hint {
  margin-top: 24rpx;
  padding: 10rpx 28rpx;
  font-size: 24rpx;
  color: $text-tertiary;
  background: $bg-gray;
  border-radius: $radius-round;
}
</style>

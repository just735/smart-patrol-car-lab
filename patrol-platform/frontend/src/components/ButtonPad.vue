<template>
  <view class="pad-wrap">
    <view class="grid">
      <button
        v-for="item in buttons"
        :key="item.key"
        :class="['cell', item.type, { empty: !item.label }]"
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
import { CarDirection } from '@/constants/car'

const emit = defineEmits(['command'])

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
  emit('command', item.direction)
}

function onRelease() {
  emit('command', CarDirection.STOP)
}
</script>

<style lang="scss" scoped>
.pad-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 520rpx;
  height: 520rpx;
  padding: 8rpx;
  background: #f0f3f8;
  border-radius: 28rpx;
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 6rpx;
  padding: 0;
  border-radius: 20rpx;
  border: none;
  box-shadow: $shadow-sm;

  &::after {
    border: none;
  }
}

.cell-arrow {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1;
}

.cell-text {
  margin-top: 4rpx;
  font-size: 26rpx;
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
}

.cell.empty {
  visibility: hidden;
  box-shadow: none;
}

.cell-active {
  opacity: 0.8;
  transform: scale(0.94);
}

.pad-hint {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>

<template>
  <view :class="['badge', type]">
    <view class="dot"></view>
    <text class="text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'offline',
  },
  text: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  border-radius: 999rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 10rpx;
  background: #8f959e;
  border-radius: 50%;
}

.text {
  line-height: 1;
}

.badge.online {
  color: #00b578;
  background: #e8fff3;

  .dot {
    background: #00b578;
  }
}

.badge.offline {
  color: #ff4d4f;
  background: #fff1f0;

  .dot {
    background: #ff4d4f;
  }
}

.badge.neutral {
  color: #1677ff;
  background: #e8f3ff;

  .dot {
    background: #1677ff;
  }
}
</style>

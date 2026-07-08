<template>
  <view class="section">
    <view class="head">
      <text class="title">{{ title }}</text>
      <text v-if="extra" class="extra">{{ extra }}</text>
    </view>
    <text v-if="desc" class="desc">{{ desc }}</text>
  </view>
</template>

<script setup>
defineProps({
  title: String,
  desc: String,
  extra: String,
})
</script>

<style lang="scss" scoped>
.section {
  margin-bottom: 20rpx;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 0.5rpx;
}

.extra {
  font-size: 22rpx;
  color: $text-tertiary;
}

.desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>

<template>
  <view class="page">
    <view class="welcome-card">
      <view class="welcome-bg"></view>
      <view class="welcome-body">
        <view class="welcome-left">
          <text class="greeting">{{ greeting }}，{{ displayName }}</text>
          <text class="sub">智能巡检车控制平台</text>
        </view>
        <view class="refresh-btn" hover-class="refresh-hover" @click="refresh">
          <text class="refresh-icon">↻</text>
        </view>
      </view>
      <view :class="['ui-badge', apiOnline ? 'online' : 'offline']">
        <view class="ui-badge-dot"></view>
        <text>{{ apiOnline ? '服务正常' : '服务离线' }}</text>
      </view>
    </view>

    <view class="status-grid">
      <view class="status-card">
        <view class="card-top">
          <view class="status-icon api">API</view>
          <view :class="['pulse', apiOnline ? 'on' : 'off']"></view>
        </view>
        <text class="status-label">后端服务</text>
        <text :class="['status-value', apiOnline ? 'online' : 'offline']">
          {{ apiOnline ? '正常运行' : '无法连接' }}
        </text>
      </view>
      <view class="status-card">
        <view class="card-top">
          <view class="status-icon tcp">TCP</view>
          <view :class="['pulse', carConnected ? 'on' : 'off']"></view>
        </view>
        <text class="status-label">小车连接</text>
        <text :class="['status-value', carConnected ? 'online' : 'offline']">
          {{ carConnected ? '已连接' : '未连接' }}
        </text>
      </view>
    </view>

    <view class="ui-section">
      <text class="ui-section-title">快捷入口</text>
      <text class="ui-section-desc">选择功能模块进入控制</text>
    </view>

    <view class="action-list">
      <view
        v-for="item in actions"
        :key="item.url"
        class="action-item"
        hover-class="action-hover"
        @click="goTab(item.url)"
      >
        <view :class="['action-icon', item.theme]">
          <text class="icon-text">{{ item.icon }}</text>
        </view>
        <view class="action-body">
          <text class="action-title">{{ item.title }}</text>
          <text class="action-desc">{{ item.desc }}</text>
        </view>
        <view class="action-arrow">
          <text>›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getDeviceStatus, getHealth } from '@/api/patrol'
import { getUser, requireLogin } from '@/utils/auth'

const apiOnline = ref(false)
const carConnected = ref(false)

const actions = [
  { url: '/pages/remote/index', icon: '控', title: '远程控制', desc: '按钮 · 摇杆 · 循迹', theme: 'control' },
  { url: '/pages/mecanum/index', icon: '麦', title: '麦克纳姆轮', desc: '四轮独立速度控制', theme: 'mecanum' },
  { url: '/pages/mine/index', icon: '设', title: '网络与账号', desc: 'IP 配置 · 连接测试', theme: 'mine' },
]

const displayName = computed(() => {
  const user = getUser()
  return user?.nickname || user?.username || '用户'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
})

async function refresh() {
  uni.showLoading({ title: '刷新中' })
  await loadStatus()
  uni.hideLoading()
  uni.showToast({ title: '已刷新', icon: 'none', duration: 800 })
}

async function loadStatus() {
  try {
    await getHealth()
    apiOnline.value = true
  } catch {
    apiOnline.value = false
    carConnected.value = false
    return
  }

  try {
    const status = await getDeviceStatus()
    carConnected.value = !!status.connected
  } catch {
    carConnected.value = false
  }
}

onShow(async () => {
  if (!requireLogin()) return
  try {
    await loadStatus()
  } catch {
    // 页面仍展示静态内容
  }
})

onPullDownRefresh(async () => {
  await loadStatus()
  uni.stopPullDownRefresh()
})

function goTab(url) {
  uni.switchTab({ url })
}
</script>

<style lang="scss" scoped>
.page {
  @include page-wrap;
}

.welcome-card {
  position: relative;
  padding: 36rpx 32rpx 28rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  background: $gradient-primary;
  border-radius: $card-radius;
  box-shadow: $shadow-primary;
}

.welcome-bg {
  position: absolute;
  top: -60rpx;
  right: -40rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.welcome-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.greeting {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.sub {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  @include glass-light;
  border-radius: 50%;
}

.refresh-icon {
  font-size: 36rpx;
  color: #fff;
}

.refresh-hover {
  opacity: 0.8;
}

.status-grid {
  display: flex;
  flex-direction: row;
  margin-bottom: 32rpx;
}

.status-card {
  flex: 1;
  padding: 24rpx;
  @include card;

  &:first-child {
    margin-right: 16rpx;
  }
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 36rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
  border-radius: 8rpx;
}

.status-icon.api {
  background: $primary;
}

.status-icon.tcp {
  background: $cyan;
}

.pulse {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.pulse.on {
  background: $success;
  box-shadow: 0 0 10rpx rgba(0, 181, 120, 0.7);
}

.pulse.off {
  background: $text-tertiary;
}

.status-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}

.status-value {
  display: block;
  margin-top: 6rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.online {
  color: $success;
}

.offline {
  color: $danger;
}

.action-list {
  display: flex;
  flex-direction: column;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  @include card;
}

.action-hover {
  background: #fafbfd;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  margin-right: 20rpx;
  border-radius: 22rpx;
}

.icon-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
}

.action-icon.control {
  background: $gradient-primary;
}

.action-icon.mecanum {
  background: $gradient-purple;
}

.action-icon.mine {
  background: linear-gradient(135deg, #13c2c2, #08979c);
}

.action-body {
  flex: 1;
}

.action-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
}

.action-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.action-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  font-size: 32rpx;
  color: $text-tertiary;
  background: #f5f7fa;
  border-radius: 50%;
}
</style>

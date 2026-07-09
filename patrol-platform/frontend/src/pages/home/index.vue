<template>
  <view class="page">
    <view class="welcome-card">
      <view class="welcome-bg"></view>
      <view class="welcome-bg welcome-bg-2"></view>
      <view class="welcome-body">
        <view class="welcome-left">
          <text class="greeting">{{ greeting }}，{{ displayName }}</text>
          <text class="sub">智能巡检车控制平台</text>
        </view>
        <view class="refresh-btn" hover-class="refresh-hover" @click="refresh">
          <text class="refresh-icon">↻</text>
        </view>
      </view>
      <view class="welcome-footer">
        <view :class="['ui-badge', apiOnline ? 'online' : 'offline']">
          <view class="ui-badge-dot"></view>
          <text>{{ apiOnline ? '服务正常' : '服务离线' }}</text>
        </view>
        <text v-if="lastRefresh" class="refresh-time">{{ lastRefresh }}</text>
      </view>
    </view>

    <view class="status-grid">
      <view class="status-card" hover-class="card-hover">
        <view class="card-top">
          <view class="status-icon api">API</view>
          <view :class="['pulse', apiOnline ? 'on' : 'off']"></view>
        </view>
        <text class="status-label">后端服务</text>
        <text :class="['status-value', apiOnline ? 'online' : 'offline']">
          {{ apiOnline ? '正常运行' : '无法连接' }}
        </text>
        <text class="status-hint">{{ apiOnline ? 'FastAPI 已就绪' : '请检查后端' }}</text>
      </view>
      <view class="status-card" hover-class="card-hover">
        <view class="card-top">
          <view class="status-icon tcp">TCP</view>
          <view :class="['pulse', carConnected ? 'on' : 'off']"></view>
        </view>
        <text class="status-label">小车连接</text>
        <text :class="['status-value', carConnected ? 'online' : 'offline']">
          {{ carConnected ? '已连接' : '未连接' }}
        </text>
        <text class="status-hint">{{ carConnected ? '通信正常' : '前往「我的」配置' }}</text>
      </view>
    </view>

    <view class="ui-section">
      <view class="ui-section-head">
        <text class="ui-section-title">快捷入口</text>
        <text class="ui-section-extra">3 个模块</text>
      </view>
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
        <view :class="['action-accent', item.theme]"></view>
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

    <view class="tip-card">
      <text class="tip-icon">💡</text>
      <view class="tip-body">
        <text class="tip-title">使用提示</text>
        <text class="tip-desc">首次使用请先在「我的」页面配置小车 IP 与端口，再进行远程控制。</text>
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
const lastRefresh = ref('')

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
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

function formatTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m} 更新`
}

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
    lastRefresh.value = formatTime()
    return
  }

  try {
    const status = await getDeviceStatus()
    carConnected.value = !!status.connected
  } catch {
    carConnected.value = false
  }
  lastRefresh.value = formatTime()
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
@import '../../uni.scss';

.page {
  @include page-wrap;
}

.welcome-card {
  position: relative;
  padding: 44rpx $space-2xl 36rpx;
  margin-bottom: 28rpx;
  overflow: hidden;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  box-shadow: $shadow-primary;
}

.welcome-bg {
  position: absolute;
  top: -60rpx;
  right: -40rpx;
  width: 240rpx;
  height: 240rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-bg-2 {
  top: auto;
  right: auto;
  bottom: -80rpx;
  left: -50rpx;
  width: 180rpx;
  height: 180rpx;
  background: rgba(255, 255, 255, 0.06);
}

.welcome-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: $space-lg;
}

.greeting {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-white;
  line-height: 1.3;
}

.sub {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: $text-white-secondary;
}

.refresh-btn {
  @include flex-center;
  width: 72rpx;
  height: 72rpx;
  @include glass-light;
  border-radius: 50%;
}

.refresh-hover {
  background: rgba(255, 255, 255, 0.28);
  transform: scale(0.95);
}

.refresh-icon {
  font-size: 40rpx;
  color: $text-white;
}

.welcome-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refresh-time {
  font-size: 22rpx;
  color: $text-white-tertiary;
}

.status-grid {
  display: flex;
  flex-direction: row;
  gap: $space-base;
  margin-bottom: $space-2xl;
}

.status-card {
  flex: 1;
  padding: $space-xl $space-lg;
  @include card;
}

.card-hover {
  @include card-hover;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-base;
}

.status-icon {
  @include flex-center;
  min-width: 64rpx;
  height: 40rpx;
  padding: 0 $space-sm;
  font-size: 20rpx;
  font-weight: 700;
  color: $text-white;
  border-radius: $radius-sm;
}

.status-icon.api {
  background: $gradient-primary;
}

.status-icon.tcp {
  background: $gradient-cyan;
}

.pulse {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.pulse.on {
  background: $success;
  box-shadow: 0 0 12rpx rgba(0, 181, 120, 0.8);
  animation: pulseOn 2s ease-in-out infinite;
}

@keyframes pulseOn {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse.off {
  background: $text-quaternary;
}

.status-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}

.status-value {
  display: block;
  margin-top: 4rpx;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.3;
}

.status-hint {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $text-tertiary;
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
  gap: $space-base;
  margin-bottom: $space-xl;
}

.action-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 28rpx $space-xl 28rpx 20rpx;
  overflow: hidden;
  @include card;
}

.action-hover {
  @include card-hover;
}

.action-accent {
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 6rpx;
  border-radius: 0 6rpx 6rpx 0;
}

.action-accent.control { background: $gradient-primary; }
.action-accent.mecanum { background: $gradient-purple; }
.action-accent.mine { background: $gradient-cyan; }

.action-icon {
  @include flex-center;
  width: 84rpx;
  height: 84rpx;
  margin-right: $space-lg;
  margin-left: 8rpx;
  border-radius: $radius-lg;
}

.icon-text {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-white;
}

.action-icon.control { background: $gradient-primary; box-shadow: 0 8rpx 20rpx rgba(22, 119, 255, 0.3); }
.action-icon.mecanum { background: $gradient-purple; box-shadow: 0 8rpx 20rpx rgba(114, 46, 209, 0.3); }
.action-icon.mine { background: $gradient-cyan; box-shadow: 0 8rpx 20rpx rgba(19, 194, 194, 0.3); }

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
  @include flex-center;
  width: 48rpx;
  height: 48rpx;
  font-size: 32rpx;
  color: $text-tertiary;
  background: $bg-gray;
  border-radius: 50%;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  padding: $space-xl;
  background: linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%);
  border: 1rpx solid rgba(250, 140, 22, 0.15);
  border-radius: $radius-xl;
}

.tip-icon {
  margin-right: $space-base;
  font-size: 36rpx;
}

.tip-title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #d46b08;
}

.tip-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #ad6800;
  line-height: 1.5;
}
</style>

<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { isLoggedIn } from '@/utils/auth'

onLaunch(() => {
  if (isLoggedIn()) {
    uni.switchTab({ url: '/pages/home/index' })
  }
})
</script>

<style>
page {
  height: 100%;
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  color: #1f2329;
  -webkit-font-smoothing: antialiased;
}

button {
  margin: 0;
  padding: 0;
  line-height: normal;
}

button::after {
  border: none;
}

/* 状态徽章 */
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  font-weight: 500;
  border-radius: 999rpx;
}

.ui-badge-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 10rpx;
  border-radius: 50%;
  background: #8f959e;
}

.ui-badge.online {
  color: #00b578;
  background: #e8fff3;
}

.ui-badge.online .ui-badge-dot {
  background: #00b578;
  box-shadow: 0 0 8rpx rgba(0, 181, 120, 0.5);
}

.ui-badge.offline {
  color: #ff4d4f;
  background: #fff1f0;
}

.ui-badge.offline .ui-badge-dot {
  background: #ff4d4f;
  box-shadow: 0 0 8rpx rgba(255, 77, 79, 0.4);
}

/* 区块标题 */
.ui-section {
  margin-bottom: 20rpx;
}

.ui-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ui-section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2329;
}

.ui-section-extra {
  font-size: 22rpx;
  color: #8f959e;
}

.ui-section-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #8f959e;
}

/* 通用卡片 */
.ui-card {
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 35, 41, 0.06);
  border: 1rpx solid rgba(31, 35, 41, 0.06);
}

/* 离线提示条 */
.ui-banner {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  border-radius: 16rpx;
}

.ui-banner.warn {
  color: #d46b08;
  background: #fff7e6;
  border: 1rpx solid rgba(250, 140, 22, 0.2);
}

.ui-banner-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}
</style>

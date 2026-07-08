<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { isLoggedIn } from '@/utils/auth'

onLaunch(() => {
  if (isLoggedIn()) {
    uni.switchTab({ url: '/pages/home/index' })
  }
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  height: 100%;
  background-color: $bg-page;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: $text-primary;
}

button {
  margin: 0;
  padding: 0;
  line-height: normal;

  &::after {
    border: none;
  }
}

.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
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

  .ui-badge-dot {
    background: #00b578;
  }
}

.ui-badge.offline {
  color: #ff4d4f;
  background: #fff1f0;

  .ui-badge-dot {
    background: #ff4d4f;
  }
}

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
</style>

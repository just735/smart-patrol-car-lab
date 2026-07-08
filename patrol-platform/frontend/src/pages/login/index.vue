<template>
  <view class="page">
    <view class="hero">
      <view class="hero-deco hero-deco-1"></view>
      <view class="hero-deco hero-deco-2"></view>
      <view class="hero-deco hero-deco-3"></view>
      <view class="hero-content">
        <view class="logo-wrap">
          <text class="logo-icon">🚗</text>
        </view>
        <text class="app-name">智能巡检车</text>
        <view class="tag-row">
          <text class="tag">远程控制</text>
          <text class="tag">实时监控</text>
          <text class="tag">TCP 协议</text>
        </view>
      </view>
    </view>

    <view class="form-card">
      <view class="mode-switch">
        <view
          :class="['mode-item', !isRegister ? 'active' : '']"
          @click="isRegister = false"
        >
          登录
        </view>
        <view
          :class="['mode-item', isRegister ? 'active' : '']"
          @click="isRegister = true"
        >
          注册
        </view>
      </view>

      <view class="field">
        <view class="input-wrap">
          <text class="input-icon">👤</text>
          <input
            v-model="username"
            class="input"
            placeholder="用户名"
            maxlength="32"
          />
        </view>
      </view>

      <view v-if="isRegister" class="field">
        <view class="input-wrap">
          <text class="input-icon">✏️</text>
          <input
            v-model="nickname"
            class="input"
            placeholder="昵称（选填）"
            maxlength="32"
          />
        </view>
      </view>

      <view class="field">
        <view class="input-wrap">
          <text class="input-icon">🔒</text>
          <input
            v-model="password"
            class="input inner"
            password
            placeholder="密码"
            maxlength="64"
          />
        </view>
      </view>

      <button class="submit-btn" :loading="loading" @click="handleSubmit">
        {{ isRegister ? '注册并登录' : '立即登录' }}
      </button>

      <view v-if="!isRegister" class="hint-box" @click="fillDemo">
        <view class="hint-left">
          <text class="hint-label">演示账号</text>
          <text class="hint-value">admin / 123456</text>
        </view>
        <text class="hint-action">一键填入 ›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login, register } from '@/api/auth'
import { setAuth } from '@/utils/auth'

const isRegister = ref(false)
const username = ref('')
const password = ref('')
const nickname = ref('')
const loading = ref(false)

function fillDemo() {
  username.value = 'admin'
  password.value = '123456'
}

async function handleSubmit() {
  if (!username.value.trim() || !password.value) {
    uni.showToast({ title: '请填写用户名和密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = isRegister.value
      ? await register(username.value.trim(), password.value, nickname.value.trim())
      : await login(username.value.trim(), password.value)

    setAuth(res.token, res.user)
    uni.showToast({ title: isRegister.value ? '注册成功' : '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/home/index' })
    }, 400)
  } catch (error) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100%;
  background: $bg-page;
}

.hero {
  position: relative;
  height: 440rpx;
  overflow: hidden;
  background: $gradient-hero;
}

.hero-deco {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.hero-deco-1 {
  top: -80rpx;
  right: -60rpx;
  width: 280rpx;
  height: 280rpx;
}

.hero-deco-2 {
  bottom: -100rpx;
  left: -80rpx;
  width: 240rpx;
  height: 240rpx;
}

.hero-deco-3 {
  top: 40%;
  right: 20%;
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
}

.hero-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 48rpx;
}

.logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  margin-bottom: 24rpx;
  @include glass-light;
  border-radius: 32rpx;
}

.logo-icon {
  font-size: 56rpx;
}

.app-name {
  font-size: 46rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2rpx;
}

.tag-row {
  display: flex;
  flex-direction: row;
  margin-top: 20rpx;
}

.tag {
  padding: 8rpx 18rpx;
  margin: 0 8rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999rpx;
}

.form-card {
  margin: -48rpx 28rpx 40rpx;
  padding: 36rpx 32rpx 40rpx;
  @include card-elevated;
}

.mode-switch {
  display: flex;
  flex-direction: row;
  padding: 6rpx;
  margin-bottom: 36rpx;
  background: #eef2f8;
  border-radius: 18rpx;
}

.mode-item {
  flex: 1;
  padding: 18rpx 0;
  font-size: 28rpx;
  text-align: center;
  color: $text-secondary;
  border-radius: 14rpx;
}

.mode-item.active {
  font-weight: 600;
  color: $primary;
  background: #fff;
  box-shadow: $shadow-sm;
}

.field {
  margin-bottom: 20rpx;
}

.input-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24rpx;
  background: #f7f9fc;
  border: 2rpx solid #eef2f8;
  border-radius: $input-radius;
}

.input-icon {
  margin-right: 16rpx;
  font-size: 32rpx;
}

.input {
  flex: 1;
  height: 92rpx;
  font-size: 30rpx;
  background: transparent;
}

.submit-btn {
  @include btn-primary;
  width: 100%;
  margin-top: 12rpx;
}

.hint-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
  padding: 22rpx 24rpx;
  background: $primary-light;
  border-radius: $input-radius;
  border: 1rpx dashed rgba(22, 119, 255, 0.25);
}

.hint-label {
  display: block;
  font-size: 22rpx;
  color: $primary-dark;
}

.hint-value {
  display: block;
  margin-top: 4rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: $primary;
}

.hint-action {
  font-size: 24rpx;
  color: $primary;
}
</style>

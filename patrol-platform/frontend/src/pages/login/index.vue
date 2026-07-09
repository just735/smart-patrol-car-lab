<template>
  <view class="page">
    <!-- 顶部品牌区 -->
    <view class="hero">
      <view class="hero-bg hero-bg-1"></view>
      <view class="hero-bg hero-bg-2"></view>
      <view class="hero-grid"></view>
      <view class="hero-inner">
        <view class="logo-box">
          <view class="logo-car">
            <view class="car-body"></view>
            <view class="car-light"></view>
            <view class="car-wheel car-wheel-l"></view>
            <view class="car-wheel car-wheel-r"></view>
          </view>
        </view>
        <text class="brand-name">智能巡检车</text>
        <text class="brand-desc">远程操控 · 实时监控 · 智能巡检</text>
      </view>
      <view class="hero-curve"></view>
    </view>

    <!-- 表单卡片 -->
    <view class="form-card">
      <view class="form-head">
        <text class="form-title">{{ isRegister ? '创建账号' : '欢迎回来' }}</text>
        <text class="form-sub">{{ isRegister ? '注册后即可使用全部功能' : '登录以继续控制巡检车' }}</text>
      </view>

      <!-- 登录 / 注册切换 -->
      <view class="tab-bar">
        <view class="tab-track">
          <view :class="['tab-slider', isRegister ? 'right' : 'left']"></view>
          <view :class="['tab-item', !isRegister ? 'active' : '']" @click="switchMode(false)">
            <text>登录</text>
          </view>
          <view :class="['tab-item', isRegister ? 'active' : '']" @click="switchMode(true)">
            <text>注册</text>
          </view>
        </view>
      </view>

      <!-- 用户名 -->
      <view class="field">
        <text class="field-label">用户名</text>
        <view :class="['input-box', focusField === 'username' ? 'focused' : '']">
          <view class="input-prefix user">
            <text class="prefix-icon">👤</text>
          </view>
          <input
            v-model="username"
            class="input"
            placeholder="请输入用户名"
            maxlength="32"
            @focus="focusField = 'username'"
            @blur="focusField = ''"
          />
          <view v-if="username" class="input-clear" @click="username = ''">
            <text>×</text>
          </view>
        </view>
      </view>

      <!-- 昵称（注册） -->
      <view v-if="isRegister" class="field field-enter">
        <text class="field-label">昵称</text>
        <view :class="['input-box', focusField === 'nickname' ? 'focused' : '']">
          <view class="input-prefix nick">
            <text class="prefix-icon">✏️</text>
          </view>
          <input
            v-model="nickname"
            class="input"
            placeholder="选填，用于显示"
            maxlength="32"
            @focus="focusField = 'nickname'"
            @blur="focusField = ''"
          />
        </view>
      </view>

      <!-- 密码 -->
      <view class="field">
        <text class="field-label">密码</text>
        <view :class="['input-box', focusField === 'password' ? 'focused' : '']">
          <view class="input-prefix lock">
            <text class="prefix-icon">🔒</text>
          </view>
          <input
            v-model="password"
            class="input"
            :password="!showPassword"
            placeholder="请输入密码"
            maxlength="64"
            @focus="focusField = 'password'"
            @blur="focusField = ''"
          />
          <view class="input-eye" @click="showPassword = !showPassword">
            <text class="eye-text">{{ showPassword ? '隐藏' : '显示' }}</text>
          </view>
        </view>
        <text v-if="isRegister && password.length > 0 && password.length < 6" class="field-hint warn">
          密码至少 6 位
        </text>
      </view>

      <!-- 确认密码（注册） -->
      <view v-if="isRegister" class="field field-enter">
        <text class="field-label">确认密码</text>
        <view :class="['input-box', focusField === 'confirm' ? 'focused' : '']">
          <view class="input-prefix lock">
            <text class="prefix-icon">🔒</text>
          </view>
          <input
            v-model="confirmPassword"
            class="input"
            :password="!showConfirm"
            placeholder="请再次输入密码"
            maxlength="64"
            @focus="focusField = 'confirm'"
            @blur="focusField = ''"
          />
          <view class="input-eye" @click="showConfirm = !showConfirm">
            <text class="eye-text">{{ showConfirm ? '隐藏' : '显示' }}</text>
          </view>
        </view>
        <text
          v-if="confirmPassword && confirmPassword !== password"
          class="field-hint warn"
        >
          两次密码不一致
        </text>
      </view>

      <!-- 提交：不用 disabled，避免微信默认灰色样式 -->
      <button
        class="submit-btn"
        hover-class="submit-hover"
        :loading="loading"
        @click="handleSubmit"
      >
        <text class="submit-text">{{ isRegister ? '注册并登录' : '立即登录' }}</text>
      </button>

      <!-- 演示账号 -->
      <view v-if="!isRegister" class="demo-card" hover-class="demo-hover" @click="fillDemo">
        <view class="demo-badge">DEMO</view>
        <view class="demo-body">
          <text class="demo-title">演示账号</text>
          <text class="demo-account">admin / 123456</text>
        </view>
        <text class="demo-btn">一键填入</text>
      </view>

      <!-- 底部切换 -->
      <view class="form-footer">
        <text class="footer-tip">{{ isRegister ? '已有账号？' : '还没有账号？' }}</text>
        <text class="footer-link" @click="switchMode(!isRegister)">
          {{ isRegister ? '去登录' : '立即注册' }}
        </text>
      </view>
    </view>

    <!-- 能力标签 -->
    <view class="feature-row">
      <view class="feature-item">
        <view class="feature-icon control"><text>控</text></view>
        <text class="feature-text">远程控制</text>
      </view>
      <view class="feature-divider"></view>
      <view class="feature-item">
        <view class="feature-icon mecanum"><text>麦</text></view>
        <text class="feature-text">麦轮驱动</text>
      </view>
      <view class="feature-divider"></view>
      <view class="feature-item">
        <view class="feature-icon track"><text>迹</text></view>
        <text class="feature-text">循迹模式</text>
      </view>
    </view>

    <text class="version">Patrol Platform v1.0</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login, register } from '@/api/auth'
import { setAuth } from '@/utils/auth'

const isRegister = ref(false)
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const focusField = ref('')

function switchMode(register) {
  isRegister.value = register
  confirmPassword.value = ''
  focusField.value = ''
}

function fillDemo() {
  username.value = 'admin'
  password.value = '123456'
  showPassword.value = false
}

async function handleSubmit() {
  if (loading.value) return

  if (!username.value.trim() || !password.value) {
    uni.showToast({ title: '请填写用户名和密码', icon: 'none' })
    return
  }

  if (isRegister.value && password.value.length < 6) {
    uni.showToast({ title: '密码至少 6 位', icon: 'none' })
    return
  }

  if (isRegister.value && password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
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
@import '../../uni.scss';

.page {
  min-height: 100%;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
  background: $bg-page;
}

/* ===== 顶部品牌 ===== */
.hero {
  position: relative;
  height: 400rpx;
  overflow: hidden;
  background: $gradient-hero;
}

.hero-curve {
  position: absolute;
  right: 0;
  bottom: -2rpx;
  left: 0;
  z-index: 2;
  height: 48rpx;
  background: $bg-page;
  border-radius: 48rpx 48rpx 0 0;
}

.hero-grid {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.05;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(255, 255, 255, 0.9) 1rpx, transparent 1rpx);
  background-size: 40rpx 40rpx;
}

.hero-bg {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.hero-bg-1 {
  top: -100rpx;
  right: -80rpx;
  width: 320rpx;
  height: 320rpx;
}

.hero-bg-2 {
  bottom: -120rpx;
  left: -60rpx;
  width: 260rpx;
  height: 260rpx;
  background: rgba(255, 255, 255, 0.05);
}

.hero-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 48rpx;
}

.logo-box {
  @include flex-center;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: $space-lg;
  background: rgba(255, 255, 255, 0.15);
  border: 2rpx solid rgba(255, 255, 255, 0.25);
  border-radius: $radius-2xl;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.logo-car {
  position: relative;
  width: 72rpx;
  height: 48rpx;
}

.car-body {
  position: absolute;
  top: 8rpx;
  left: 4rpx;
  width: 64rpx;
  height: 32rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10rpx 10rpx 6rpx 6rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.car-light {
  position: absolute;
  top: 16rpx;
  left: 10rpx;
  width: 12rpx;
  height: 8rpx;
  background: #ffe58f;
  border-radius: 4rpx;
  box-shadow: 0 0 8rpx rgba(255, 229, 143, 0.8);
}

.car-wheel {
  position: absolute;
  bottom: 0;
  width: 18rpx;
  height: 18rpx;
  background: rgba(255, 255, 255, 0.7);
  border: 3rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.car-wheel-l { left: 10rpx; }
.car-wheel-r { right: 10rpx; }

.brand-name {
  font-size: 48rpx;
  font-weight: 700;
  color: $text-white;
  letter-spacing: 4rpx;
}

.brand-desc {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $text-white-tertiary;
  letter-spacing: 1rpx;
}

/* ===== 表单卡片 ===== */
.form-card {
  position: relative;
  z-index: 3;
  margin: -24rpx 28rpx 0;
  padding: 40rpx 32rpx 36rpx;
  @include card-elevated;
}

.form-head {
  margin-bottom: 32rpx;
}

.form-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
}

.form-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: $text-tertiary;
}

/* Tab 切换 */
.tab-bar {
  margin-bottom: 36rpx;
}

.tab-track {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 6rpx;
  background: $bg-gray;
  border-radius: $radius-lg;
}

.tab-slider {
  position: absolute;
  top: 6rpx;
  bottom: 6rpx;
  width: calc(50% - 6rpx);
  background: $card-bg;
  border-radius: $radius-sm;
  box-shadow: $shadow-xs;
  @include transition-fast;
}

.tab-slider.left { left: 6rpx; }
.tab-slider.right { left: calc(50%); }

.tab-item {
  @include flex-center;
  position: relative;
  z-index: 1;
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  color: $text-secondary;
  @include transition-fast;
}

.tab-item.active {
  font-weight: 600;
  color: $primary;
}

/* 输入框 */
.field {
  margin-bottom: 28rpx;
}

.field-enter {
  animation: fadeSlide 0.25s ease-out;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(-12rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.field-label {
  @include field-label;
  margin-bottom: 10rpx;
}

.input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 96rpx;
  background: $bg-light;
  border: 2rpx solid $border-light;
  border-radius: $radius-lg;
  @include transition-fast;
}

.input-box.focused {
  background: $card-bg;
  border-color: $primary;
  box-shadow: 0 0 0 6rpx rgba(22, 119, 255, 0.08);
}

.input-prefix {
  @include flex-center;
  width: 64rpx;
  height: 64rpx;
  margin-left: 16rpx;
  border-radius: $radius-sm;
}

.prefix-icon {
  font-size: 30rpx;
  line-height: 1;
}

.input-prefix.user { background: $primary-light; }
.input-prefix.nick { background: $purple-light; }
.input-prefix.lock { background: $cyan-light; }

.input {
  flex: 1;
  height: 96rpx;
  padding: 0 16rpx;
  font-size: 30rpx;
  background: transparent;
}

.input-clear,
.input-eye {
  @include flex-center;
  height: 96rpx;
  padding: 0 20rpx;
}

.eye-text {
  font-size: 24rpx;
  font-weight: 500;
  color: $primary;
}

.input-clear text {
  font-size: 40rpx;
  line-height: 1;
  color: $text-quaternary;
}

.field-hint {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $text-tertiary;
}

.field-hint.warn {
  color: $danger;
}

/* 提交按钮 */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100rpx;
  margin-top: 12rpx;
  padding: 0;
  line-height: 100rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  border: none;
  border-radius: $radius-lg;
  box-shadow: 0 12rpx 32rpx rgba(22, 119, 255, 0.35);
}

.submit-btn::after {
  border: none;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2rpx;
}

.submit-hover {
  opacity: 0.92;
  transform: scale(0.98);
}

/* 演示账号 */
.demo-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 28rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, $primary-lighter 0%, #f0f7ff 100%);
  border: 1rpx solid rgba(22, 119, 255, 0.15);
  border-radius: $radius-lg;
}

.demo-hover {
  background: $primary-light;
}

.demo-badge {
  padding: 8rpx 14rpx;
  margin-right: $space-base;
  font-size: 20rpx;
  font-weight: 700;
  color: $primary;
  letter-spacing: 2rpx;
  background: $card-bg;
  border-radius: $radius-xs;
}

.demo-body {
  flex: 1;
}

.demo-title {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}

.demo-account {
  display: block;
  margin-top: 4rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: $primary;
  font-family: 'Courier New', monospace;
}

.demo-btn {
  padding: 14rpx 28rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  background: $gradient-primary;
  border-radius: $radius-round;
  box-shadow: 0 6rpx 16rpx rgba(22, 119, 255, 0.25);
}

/* 底部切换 */
.form-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
}

.footer-tip {
  font-size: 26rpx;
  color: $text-tertiary;
}

.footer-link {
  margin-left: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: $primary;
}

/* 能力标签 */
.feature-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 28rpx 28rpx 0;
  padding: 24rpx 12rpx;
  @include card;
}

.feature-item {
  @include flex-center;
  flex: 1;
  flex-direction: column;
}

.feature-icon {
  @include flex-center;
  width: 60rpx;
  height: 60rpx;
  border-radius: $radius-base;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
}

.feature-icon text {
  font-size: 26rpx;
  font-weight: 700;
  color: #ffffff;
}

.feature-icon.control { background: $gradient-primary; }
.feature-icon.mecanum { background: $gradient-purple; }
.feature-icon.track { background: $gradient-cyan; }

.feature-text {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $text-secondary;
}

.feature-divider {
  width: 1rpx;
  height: 52rpx;
  background: $border-light;
}

.version {
  display: block;
  margin-top: 28rpx;
  padding-bottom: 16rpx;
  font-size: 22rpx;
  text-align: center;
  color: $text-quaternary;
  letter-spacing: 2rpx;
}
</style>

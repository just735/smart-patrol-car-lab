const TOKEN_KEY = 'patrol_token'
const USER_KEY = 'patrol_user'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setAuth(token, user) {
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_KEY, user)
}

export function getUser() {
  return uni.getStorageSync(USER_KEY) || null
}

export function clearAuth() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

export function requireLogin() {
  if (!isLoggedIn()) {
    uni.reLaunch({ url: '/pages/login/index' })
    return false
  }
  return true
}

import { BASE_URL } from './config'
import { clearAuth, getToken } from '@/utils/auth'

export function request(options) {
  const token = getToken()
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
      success: (res) => {
        const isAuthRoute = (options.url || '').startsWith('/api/auth/')
        if (res.statusCode === 401 && !isAuthRoute) {
          clearAuth()
          uni.reLaunch({ url: '/pages/login/index' })
          reject(new Error('登录已过期，请重新登录'))
          return
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          const detail = res.data?.detail || '请求失败'
          reject(new Error(typeof detail === 'string' ? detail : JSON.stringify(detail)))
        }
      },
      fail: reject,
    })
  })
}

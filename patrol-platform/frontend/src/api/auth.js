import { request } from './request'

export function login(username, password) {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data: { username, password },
  })
}

export function register(username, password, nickname = '') {
  return request({
    url: '/api/auth/register',
    method: 'POST',
    data: { username, password, nickname },
  })
}

export function getProfile() {
  return request({ url: '/api/auth/me' })
}

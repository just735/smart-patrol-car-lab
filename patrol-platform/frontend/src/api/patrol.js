import { request } from './request'

export function getHealth() {
  return request({ url: '/api/health' })
}

export function getDeviceStatus() {
  return request({ url: '/api/device/status' })
}

export function sendButton(direction) {
  return request({
    url: '/api/device/button',
    method: 'POST',
    data: { direction },
  })
}

export function sendRocker(speedX, speedY) {
  return request({
    url: '/api/device/rocker',
    method: 'POST',
    data: { speed_x: speedX, speed_y: speedY },
  })
}

export function sendMecanum(l1, l2, r1, r2) {
  return request({
    url: '/api/device/mecanum',
    method: 'POST',
    data: { l1, l2, r1, r2 },
  })
}

export function sendTracking(action) {
  return request({
    url: '/api/device/tracking',
    method: 'POST',
    data: { action },
  })
}

export function testConnect() {
  return request({ url: '/api/device/connect', method: 'POST' })
}

export function disconnectDevice() {
  return request({ url: '/api/device/disconnect', method: 'POST' })
}

export function saveNetworkConfig(config) {
  return request({
    url: '/api/device/network',
    method: 'POST',
    data: config,
  })
}

export function getNetworkConfig() {
  return request({ url: '/api/device/network' })
}

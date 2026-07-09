import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { syncWeixinAppId } = require('./scripts/sync-weixin-appid.js')

function weixinAppIdPlugin() {
  let syncedAppId = ''

  return {
    name: 'weixin-appid-sync',
    enforce: 'pre',
    config() {
      if (process.env.UNI_PLATFORM !== 'mp-weixin') return
      const result = syncWeixinAppId({ patchOutput: false })
      if (!result.ok) {
        console.warn(
          '\n[weixin] 未配置 AppID，HBuilderX 自动打开微信开发者工具会报 41002。',
        )
        console.warn('[weixin] 请创建 weixin.appid.json 或运行 scripts\\setup-weixin-appid.bat\n')
        return
      }
      syncedAppId = result.appid
    },
    closeBundle() {
      if (process.env.UNI_PLATFORM !== 'mp-weixin' || !syncedAppId) return
      syncWeixinAppId({ silent: true, patchOutput: true })
      console.log(`[weixin] 输出目录已写入 AppID: ${syncedAppId}`)
    },
  }
}

export default defineConfig({
  plugins: [weixinAppIdPlugin(), uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})

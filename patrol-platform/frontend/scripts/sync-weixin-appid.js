const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const APPID_FILE = path.join(ROOT, 'weixin.appid.json')
const MANIFEST = path.join(ROOT, 'src', 'manifest.json')
const PROJECT_CONFIG = path.join(ROOT, 'src', 'project.config.json')

const PRIVATE_PATHS = [
  path.join(ROOT, 'src', 'project.private.config.json'),
  path.join(ROOT, 'project.private.config.json'),
  path.join(ROOT, 'dist', 'dev', 'mp-weixin', 'project.private.config.json'),
  path.join(ROOT, 'dist', 'build', 'mp-weixin', 'project.private.config.json'),
]

const OUTPUT_DIRS = [
  path.join(ROOT, 'dist', 'dev', 'mp-weixin'),
  path.join(ROOT, 'dist', 'build', 'mp-weixin'),
  path.join(ROOT, 'unpackage', 'dist', 'dev', 'mp-weixin'),
  path.join(ROOT, 'unpackage', 'dist', 'build', 'mp-weixin'),
]

function isValidAppId(appid) {
  return typeof appid === 'string' && /^wx[0-9a-fA-F]{16}$/.test(appid)
}

function loadAppId() {
  if (process.env.WEIXIN_APPID && isValidAppId(process.env.WEIXIN_APPID)) {
    return process.env.WEIXIN_APPID
  }

  if (fs.existsSync(APPID_FILE)) {
    const data = JSON.parse(fs.readFileSync(APPID_FILE, 'utf8'))
    if (isValidAppId(data.appid)) return data.appid
  }

  for (const filePath of PRIVATE_PATHS) {
    if (!fs.existsSync(filePath)) continue
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (isValidAppId(data.appid)) return data.appid
    } catch {
      // ignore
    }
  }

  return ''
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function syncManifest(appid) {
  let content = fs.readFileSync(MANIFEST, 'utf8')
  const updated = content.replace(
    /("mp-weixin"\s*:\s*\{[\s\S]*?"appid"\s*:\s*)"[^"]*"/,
    `$1"${appid}"`,
  )
  if (updated === content) {
    // 检查是否已经是正确的 appid
    const currentAppIdMatch = content.match(/"mp-weixin"\s*:\s*\{[\s\S]*?"appid"\s*:\s*"([^"]*)"/)
    if (currentAppIdMatch && currentAppIdMatch[1] === appid) {
      return // AppID 已经正确，无需更新
    }
    throw new Error('无法在 manifest.json 中写入 mp-weixin.appid')
  }
  fs.writeFileSync(MANIFEST, updated, 'utf8')
}

function syncProjectConfig(appid, filePath = PROJECT_CONFIG) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  data.appid = appid
  writeJson(filePath, data)
}

function syncPrivateConfig(appid) {
  const payload = { appid, description: '本地私有配置，勿提交 git' }
  writeJson(path.join(ROOT, 'src', 'project.private.config.json'), payload)
  writeJson(path.join(ROOT, 'project.private.config.json'), payload)
}

function syncOutputDirs(appid) {
  for (const dir of OUTPUT_DIRS) {
    const projectConfig = path.join(dir, 'project.config.json')
    const privateConfig = path.join(dir, 'project.private.config.json')
    try {
      if (fs.existsSync(projectConfig)) {
        syncProjectConfig(appid, projectConfig)
      }
      if (fs.existsSync(dir)) {
        writeJson(privateConfig, { appid })
      }
    } catch {
      // 编译前输出目录可能尚未生成，忽略
    }
  }
}

function printHelp() {
  console.error('\n[weixin] 缺少有效 AppID，微信开发者工具 CLI 会报 41002 appid missing。')
  console.error('[weixin] HBuilderX 不会执行 npm predev，请手动配置 AppID：')
  console.error('')
  console.error('  1. 复制 weixin.appid.example.json 为 weixin.appid.json')
  console.error('  2. 填入 AppID（wx 开头 18 位）')
  console.error('  3. 重新在 HBuilderX 运行到微信开发者工具')
  console.error('')
  console.error('  获取 AppID：')
  console.error('    A. https://mp.weixin.qq.com/ → 开发 → 开发设置')
  console.error('    B. 手动导入 dist/dev/mp-weixin 选「测试号」，')
  console.error('       从 project.private.config.json 复制 appid 到 weixin.appid.json')
  console.error('')
  console.error('  也可运行: scripts\\setup-weixin-appid.bat')
  console.error('')
}

function syncWeixinAppId(options = {}) {
  const { silent = false, patchOutput = true } = options
  const appid = loadAppId()

  if (!isValidAppId(appid)) {
    if (!silent) printHelp()
    return { ok: false, appid: '' }
  }

  syncManifest(appid)
  syncProjectConfig(appid)
  syncPrivateConfig(appid)
  if (patchOutput) syncOutputDirs(appid)

  if (!silent) {
    console.log(`[weixin] 已同步 AppID: ${appid}`)
  }

  return { ok: true, appid }
}

function main() {
  const result = syncWeixinAppId()
  if (!result.ok) process.exit(1)
}

module.exports = { syncWeixinAppId, isValidAppId, loadAppId }

if (require.main === module) {
  main()
}

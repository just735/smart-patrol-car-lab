# 智能巡检车 UniApp 小程序 + FastAPI 后端

功能对齐 `06-harmonyos-app-development`，并增加账号登录与底部 Tab 导航。

## 功能对照

| 模块 | 鸿蒙 | 本工程 |
|------|------|--------|
| 登录 | — | `pages/login` |
| 首页 | Index.ets | `pages/home`（Tab） |
| 远程控制 | RemoteControl.ets | `pages/remote`（Tab） |
| 按钮 3×3 控制 | CarBtnComponents | `components/ButtonPad` |
| 摇杆控制 | CarRockerComponents | `components/RockerPad` |
| 循迹开/关 | TrackingOpen/Close | `/api/device/tracking` |
| 麦克纳姆轮 | MecanumWheel.ets | `pages/mecanum`（Tab） |
| 网络配置 | NetworkSettings.ets | `pages/mine`（Tab · 我的） |
| TCP 协议 | CarEncode.ets | `backend/app/car_encode.py` |
| TCP 连接 | TCPClientManager.ets | `backend/app/tcp_client.py` |
| 账号鉴权 | — | JWT · `backend/app/auth_store.py` |

## 启动

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

文档：http://127.0.0.1:8000/docs

### 前端

```bash
cd frontend
npm install
npm run dev:mp-weixin
# 或 npm run build:mp-weixin
```

微信开发者工具导入 `frontend/dist/dev/mp-weixin` 或 `frontend/dist/build/mp-weixin`。

修改 `frontend/src/api/config.js` 中的 `BASE_URL` 指向后端（默认 `http://127.0.0.1:8000`）。

### 微信开发者工具 / HBuilderX 配置

HBuilderX 自动打开微信开发者工具时，**必须配置有效 AppID**（`wx` + 16 位，共 18 位），空字符串会报 `41002 appid missing`。

**配置步骤（任选一种）：**

**方式 A — 微信公众平台（推荐）**
1. 打开 https://mp.weixin.qq.com/ 注册/登录小程序
2. 开发 → 开发管理 → 开发设置 → 复制 **AppID**
3. 在 `frontend` 目录执行：
   ```bash
   copy weixin.appid.example.json weixin.appid.json
   ```
4. 编辑 `weixin.appid.json`，填入 `"appid": "wx你的AppID"`
5. 运行 `npm run dev:mp-weixin` 或在 HBuilderX 重新运行到微信

**方式 B — 测试号**
1. 先手动打开微信开发者工具，导入 `dist/build/mp-weixin`，AppID 选 **「测试号」**
2. 打开生成后的 `dist/build/mp-weixin/project.private.config.json`，复制其中的 `appid`
3. 写入 `frontend/weixin.appid.json`
4. 再运行 `npm run dev:mp-weixin`

**快捷配置（Windows）**：双击运行 `frontend/scripts/setup-weixin-appid.bat`，按提示粘贴 AppID。

npm 构建/开发前会自动执行 `scripts/sync-weixin-appid.js`；**HBuilderX 不跑 npm 钩子**，已在 `vite.config.js` 插件中于编译时同步 AppID 并写入输出目录。未配置 AppID 时仍可编译，但 HBuilderX 自动打开微信开发者工具会失败。

**本地设置**：勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」。

## 默认账号

| 字段 | 值 |
|------|-----|
| 用户名 | `admin` |
| 密码 | `123456` |

首次启动后端会自动创建用户，数据保存在 `backend/data/users.json`。

## 默认网络配置

| 项 | 值 |
|----|-----|
| 小车 IP | `192.168.1.11` |
| TCP 端口 | `6000` |
| 视频端口 | `6500` |

保存在 `backend/data/network.json`，可在小程序「我的」页修改并测试连接。

## Tab 导航

| Tab | 页面 | 说明 |
|-----|------|------|
| 首页 | `pages/home` | 服务/小车状态、快捷入口 |
| 控制 | `pages/remote` | 按钮、摇杆、循迹 |
| 麦轮 | `pages/mecanum` | 四轮独立速度 |
| 我的 | `pages/mine` | 网络配置、退出登录 |

## API 说明

- 公开：`GET /api/health`、`POST /api/auth/login`、`POST /api/auth/register`
- 需登录（Bearer Token）：其余 `/api/device/*`、`GET /api/auth/me`

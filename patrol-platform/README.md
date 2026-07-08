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

### 微信开发者工具配置

1. **AppID**：导入项目时在 AppID 下拉框选择 **「测试号」**（不要手动填 `touristappid`，新版工具已不支持）
2. **本地设置**：勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」
3. 若报 `appid missing`：关闭项目 → 重新导入 `dist/build/mp-weixin` → 导入界面选 **测试号** → 编译

`manifest.json` 中 `mp-weixin.appid` 留空即可，由开发者工具的测试号自动接管。

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

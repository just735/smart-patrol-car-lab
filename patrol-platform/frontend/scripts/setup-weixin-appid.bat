@echo off
chcp 65001 >nul
cd /d "%~dp0.."

echo.
echo ========================================
echo   微信小程序 AppID 配置向导
echo ========================================
echo.
echo AppID 格式: wx 开头，共 18 位
echo 获取方式:
echo   1. https://mp.weixin.qq.com/ 注册小程序
echo   2. 或微信开发者工具手动导入选「测试号」后复制 project.private.config.json
echo.

set /p APPID=请输入 AppID: 

if "%APPID%"=="" (
  echo [错误] AppID 不能为空
  exit /b 1
)

echo {"appid":"%APPID%"}> weixin.appid.json
node scripts\sync-weixin-appid.js
if errorlevel 1 exit /b 1

echo.
echo [完成] 请在 HBuilderX 重新「运行到微信开发者工具」
echo.
pause

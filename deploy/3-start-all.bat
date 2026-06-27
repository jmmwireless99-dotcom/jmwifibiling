@echo off
title JM Billing + Cloudflare Tunnel
cd /d "%~dp0\.."

echo.
echo   ============================================================
echo    JM Billing System — starting
echo   ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

sc query cloudflared | find "RUNNING" >nul
if errorlevel 1 (
  echo   [!] Cloudflare tunnel service is not running.
  echo       Run deploy\2-install-tunnel.bat first, or: net start cloudflared
  echo.
) else (
  echo   [OK] Cloudflare tunnel is running
)

echo   Starting billing panel on http://localhost:3000
echo   Public URL: https://billing.jmwifi.pro
echo.
echo   Keep this window open. Press Ctrl+C to stop.
echo.

start "" cmd /c "timeout /t 2 >nul & start http://localhost:3000"
node server.js

pause

@echo off
title Install Cloudflare Tunnel Service
cd /d "%~dp0"

set CLOUDFLARED=C:\Cloudflare\cloudflared.exe
if not exist "%CLOUDFLARED%" (
  echo.
  echo   cloudflared not found at %CLOUDFLARED%
  echo   Run deploy\install-cloudflared.bat first.
  echo.
  pause
  exit /b 1
)

echo.
echo   ============================================================
echo    Cloudflare Tunnel — install Windows service
echo   ============================================================
echo.
echo   Get your token from Cloudflare Zero Trust:
echo   https://one.dash.cloudflare.com -^> Networks -^> Tunnels -^> jm-billing
echo   Copy the token from the install command (starts with eyJ...)
echo.
set /p TOKEN="Paste tunnel token here: "

if "%TOKEN%"=="" (
  echo   No token entered. Exiting.
  pause
  exit /b 1
)

echo.
echo   Installing cloudflared as a Windows service...
"%CLOUDFLARED%" service install %TOKEN%

if errorlevel 1 (
  echo.
  echo   Install failed. Try running this file as Administrator:
  echo   Right-click -^> Run as administrator
  echo.
  pause
  exit /b 1
)

echo.
echo   Starting Cloudflared agent service...
net start cloudflared 2>nul
sc query cloudflared

echo.
echo   Tunnel service installed. Next: run deploy\3-start-all.bat
echo.
pause

@echo off
title JM Billing — autostart at Windows login
cd /d "%~dp0\.."

set APPDIR=%CD%
set NODEEXE=
for /f "delims=" %%i in ('where node 2^>nul') do set NODEEXE=%%i

if "%NODEEXE%"=="" (
  echo Node.js not found.
  pause
  exit /b 1
)

echo Creating scheduled task "JM-Billing-Panel"...
echo App folder: %APPDIR%

schtasks /Create /F /TN "JM-Billing-Panel" /SC ONLOGON /RL LIMITED /TR "\"%NODEEXE%\" \"%APPDIR%\server.js\"" /RU "%USERNAME%"

if errorlevel 1 (
  echo.
  echo Failed. Try: Right-click this file -^> Run as administrator
  pause
  exit /b 1
)

echo.
echo Done. JM Billing will start when you log in to Windows.
echo Tunnel autostart: cloudflared runs as a Windows service after 2-install-tunnel.bat
pause

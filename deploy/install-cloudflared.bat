@echo off
title Download cloudflared
cd /d "%~dp0"

set DEST=C:\Cloudflare
set EXE=%DEST%\cloudflared.exe

if exist "%EXE%" (
  echo   cloudflared already exists: %EXE%
  "%EXE%" --version
  pause
  exit /b 0
)

echo   Downloading cloudflared to %DEST%...
mkdir "%DEST%" 2>nul

powershell -NoProfile -Command ^
  "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%EXE%' -UseBasicParsing"

if not exist "%EXE%" (
  echo   Download failed.
  pause
  exit /b 1
)

"%EXE%" --version
echo.
echo   Done. Next: read deploy\1-SETUP-CLOUDFLARE-DNS.txt
pause

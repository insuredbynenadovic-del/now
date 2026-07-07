@echo off
title Jarvis
cd /d "%~dp0"

REM First run: make the key file and open it for you to paste your key.
if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo.
  echo  ================= FIRST-TIME SETUP =================
  echo  I just opened your key file in Notepad.
  echo  Replace  sk-ant-your-key-here  with your real Claude key,
  echo  then SAVE and CLOSE Notepad, and run this file again.
  echo  ===================================================
  echo.
  notepad .env
  pause
  exit /b
)

REM Install once (needs Node.js from https://nodejs.org installed first).
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed yet.
  echo  Get it free at https://nodejs.org  (click the green LTS button),
  echo  install it, then run this file again.
  echo.
  pause
  exit /b
)
if not exist "node_modules" (
  echo  First-time setup - installing, please wait a minute...
  call npm install
)

echo.
echo  Starting Jarvis. A Chrome tab will open in a few seconds.
echo  KEEP THIS WINDOW OPEN while you use Jarvis. Close it to stop.
echo.
start "" http://localhost:3000/jarvis.html
call npm start
pause

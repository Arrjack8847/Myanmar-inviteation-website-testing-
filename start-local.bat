@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js and try again.
  pause
  exit /b 1
)
echo Golden Autumn Heritage local preview.
echo Open http://localhost:4173 in your browser.
node server.js
pause

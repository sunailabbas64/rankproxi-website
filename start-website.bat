@echo off
title Rank Proxi website
cd /d "%~dp0"

curl -s -o NUL --max-time 2 http://127.0.0.1:4173/
if %errorlevel%==0 goto running

echo.
echo   Starting the Rank Proxi website...
echo.
echo   Keep this window OPEN while you browse the site.
echo   Close this window to stop the server.
echo.
start "" http://127.0.0.1:4173/
node server.js
echo.
echo   Server stopped. Press any key to close.
pause >nul
exit /b

:running
echo.
echo   The website is already running at http://127.0.0.1:4173/
echo   Opening it in your browser...
start "" http://127.0.0.1:4173/
ping -n 3 127.0.0.1 >nul
exit /b
@echo off
title SMKC Drishti-Banner Portal
echo ========================================================
echo Sangli Miraj Kupwad Municipal Corporation (SMKC)
echo Starting AI Illegal Hoarding Detection Full-Stack System
echo ========================================================
if not exist node_modules (
    echo [INFO] Installing dependencies (npm install)...
    call npm install
    echo.
)

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/
echo.
npm run dev
pause

@echo off
title SBI Online Banking Portal - Local Runner
color 0A

echo ============================================================
echo   SBI Online Banking Portal - Local Runner
echo ============================================================
echo.

set PATH=C:\Program Files\nodejs;C:\Users\Lenovo\AppData\Local\Programs\Python\Python312;C:\Users\Lenovo\AppData\Local\Programs\Python\Python312\Scripts;%PATH%

cd /d "%~dp0sbi-banking" 2>nul || cd /d "%~dp0"

echo [1/3] Checking & Seeding Database...
backend\venv\Scripts\python.exe -m app.db.seed

echo.
echo [2/3] Starting FastAPI Backend on port 8000 (0.0.0.0:8000)...
start "SBI Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo [3/3] Starting Next.js Frontend on port 3000 (0.0.0.0:3000)...
start "SBI Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && set PATH=C:\Program Files\nodejs;%PATH% && npm.cmd run dev"

echo.
echo ============================================================
echo   Portal is running!
echo   - Local Frontend:    http://localhost:3000
echo   - Network Frontend:  http://192.168.0.10:3000
echo   - Backend API Docs:  http://localhost:8000/api/docs
echo.
echo   Demo Credentials:
echo   - Admin:    admin / Admin@SBI123
echo   - Customer: rahul.sharma / Rahul@1234
echo   - Customer: priya.singh / Priya@1234
echo ============================================================
pause

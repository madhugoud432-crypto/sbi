@echo off
title SBI Online Banking Portal - Docker Runner
color 0B

echo ============================================================
echo   SBI Online Banking Portal - Docker Runner
echo ============================================================
echo.

cd /d "%~dp0sbi-banking" 2>nul || cd /d "%~dp0"

echo Checking Docker daemon...
docker version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTE] Docker Desktop Linux Engine is not currently reachable.
    echo If virtualization is disabled on your PC, please ensure:
    echo 1. Hardware Virtualization (VT-x / AMD-V) is enabled in BIOS.
    echo 2. Windows Virtual Machine Platform is enabled.
    echo.
    echo In the meantime, you can run the project locally using:
    echo run_local.bat
    echo.
) else (
    echo Building and starting containers...
    docker compose up --build -d
    echo.
    echo ============================================================
    echo   Containers Started!
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:8000
    echo   - API Docs: http://localhost:8000/api/docs
    echo ============================================================
)

pause

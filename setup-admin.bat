@echo off
echo ========================================
echo Pizza Hut Admin Dashboard Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install bcryptjs
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Creating Admin Account...
call node createAdmin.js
if %errorlevel% neq 0 (
    echo Warning: Admin creation had issues, but continuing...
)
echo.

echo [3/4] Installing Frontend Dependencies...
cd ..\Login
call npm install chart.js react-chartjs-2
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [4/4] Setup Complete!
echo ========================================
echo.
echo Admin Credentials:
echo Email: admin@pizzahut.com
echo Password: Admin@123
echo.
echo To start the application:
echo 1. Backend: cd backend && npm start
echo 2. Frontend: cd Login && npm run dev
echo 3. Access Admin: http://localhost:5173/admin/login
echo.
echo ========================================
pause

@echo off
echo ========================================
echo Pizza Hut Admin Email Update
echo ========================================
echo.
echo Updating admin email to: adminpizzahut@gmail.com
echo.
cd backend
node createAdmin.js
echo.
echo ========================================
echo Admin email updated successfully!
echo.
echo New Login Credentials:
echo Email: adminpizzahut@gmail.com
echo Password: Admin@123
echo ========================================
pause

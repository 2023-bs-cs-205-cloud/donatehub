@echo off
echo Restoring DonateHub after GitHub upload...

REM Restore node_modules folders
if exist "temp_backup\frontend_node_modules" (
    echo Restoring frontend node_modules...
    move "temp_backup\frontend_node_modules" "frontend\node_modules"
)

if exist "temp_backup\backend_node_modules" (
    echo Restoring backend node_modules...
    move "temp_backup\backend_node_modules" "backend\node_modules"
)

REM Restore .env files
if exist "temp_backup\frontend_env" (
    echo Restoring frontend .env...
    move "temp_backup\frontend_env" "frontend\.env"
)

if exist "temp_backup\backend_env" (
    echo Restoring backend .env...
    move "temp_backup\backend_env" "backend\.env"
)

REM Restore build folders
if exist "temp_backup\frontend_build" (
    echo Restoring frontend build...
    move "temp_backup\frontend_build" "frontend\build"
)

REM Remove backup directory
if exist "temp_backup" (
    echo Cleaning up backup directory...
    rmdir /s /q "temp_backup"
)

echo.
echo ✅ Project restored successfully!
echo 🚀 You can now run your website locally again
echo.
pause

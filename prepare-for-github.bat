@echo off
echo Preparing DonateHub for GitHub upload...

REM Create backup directory
if not exist "temp_backup" mkdir temp_backup

REM Move node_modules folders to backup
if exist "frontend\node_modules" (
    echo Moving frontend node_modules to backup...
    move "frontend\node_modules" "temp_backup\frontend_node_modules"
)

if exist "backend\node_modules" (
    echo Moving backend node_modules to backup...
    move "backend\node_modules" "temp_backup\backend_node_modules"
)

REM Move .env files to backup
if exist "frontend\.env" (
    echo Moving frontend .env to backup...
    move "frontend\.env" "temp_backup\frontend_env"
)

if exist "backend\.env" (
    echo Moving backend .env to backup...
    move "backend\.env" "temp_backup\backend_env"
)

REM Move build folders to backup
if exist "frontend\build" (
    echo Moving frontend build to backup...
    move "frontend\build" "temp_backup\frontend_build"
)

echo.
echo ✅ Project prepared for GitHub upload!
echo 📁 node_modules and .env files moved to temp_backup/
echo 📊 Project size should now be under 25MB
echo.
echo 🚀 You can now upload to GitHub!
echo.
echo After upload, run restore-after-github.bat to restore everything
echo.
pause

@echo off
echo ========================================
echo    Update Vercel Environment Variables
echo ========================================
echo.

echo Your frontend is deployed at:
echo https://frontend-3i9a7via5-2023-bs-cs-205-5818s-projects.vercel.app
echo.

echo Please provide your backend URL (e.g., https://donatehub-backend.onrender.com):
set /p BACKEND_URL=

echo.
echo Updating Vercel environment variables...
echo Backend URL: %BACKEND_URL%

echo.
echo Please follow these steps:
echo.
echo 1. Go to Vercel Dashboard: https://vercel.com/dashboard
echo 2. Select your project: frontend-3i9a7via5-2023-bs-cs-205-5818s-projects
echo 3. Go to Settings ^> Environment Variables
echo 4. Add new variable:
echo    Name: REACT_APP_API_URL
echo    Value: %BACKEND_URL%
echo 5. Click Save
echo 6. Go to Deployments tab
echo 7. Click "Redeploy" on the latest deployment
echo.
echo After redeployment, your DonateHub will be fully functional!
echo.
echo Your URLs will be:
echo Frontend: https://frontend-3i9a7via5-2023-bs-cs-205-5818s-projects.vercel.app
echo Backend: %BACKEND_URL%
echo.
pause

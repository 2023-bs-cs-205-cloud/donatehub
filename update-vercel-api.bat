@echo off
echo Updating Vercel API URL...

echo.
echo Please provide your backend URL (e.g., https://donatehub-backend.onrender.com):
set /p BACKEND_URL=

echo.
echo Updating Vercel environment variables...
echo Backend URL: %BACKEND_URL%

echo.
echo Please run these commands in your terminal:
echo.
echo 1. Go to Vercel Dashboard: https://vercel.com/dashboard
echo 2. Select your DonateHub project
echo 3. Go to Settings ^> Environment Variables
echo 4. Add new variable:
echo    Name: REACT_APP_API_URL
echo    Value: %BACKEND_URL%
echo 5. Click Save
echo 6. Go to Deployments tab
echo 7. Click "Redeploy" on the latest deployment
echo.
echo After redeployment, your app will be fully functional!
echo.
pause

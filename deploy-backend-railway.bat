@echo off
echo Deploying DonateHub Backend to Railway...
echo.

echo Installing Railway CLI...
npm install -g @railway/cli

echo.
echo Logging into Railway...
railway login

echo.
echo Deploying backend...
cd backend
railway up

echo.
echo Backend deployment complete!
echo Your backend URL will be shown above.
echo.
pause

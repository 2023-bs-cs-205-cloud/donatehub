@echo off
echo Deploying DonateHub to Vercel...
echo.

echo Installing Vercel CLI...
npm install -g vercel

echo.
echo Deploying frontend to Vercel...
cd frontend
vercel --prod

echo.
echo Deployment complete!
echo Your website will be available at the URL shown above.
echo.
pause

@echo off
echo Testing DonateHub Deployment...
echo.

echo 1. Testing Backend Health...
curl https://your-railway-url.up.railway.app/api/health
echo.

echo 2. Testing Frontend...
echo Visit: https://donatehub-b773ypgp6-2023-bs-cs-205-5818s-projects.vercel.app
echo.

echo 3. Test Registration...
echo Try to register a new account on your frontend
echo.

echo 4. Test Login...
echo Try to login with the account you just created
echo.

echo If both work, your deployment is successful!
echo.
pause

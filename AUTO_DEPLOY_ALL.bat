@echo off
echo ========================================
echo    DonateHub Complete Deployment
echo ========================================
echo.

echo Step 1: Deploying Frontend to Vercel...
cd frontend
vercel --prod --yes
cd ..

echo.
echo Step 2: Backend Deployment Instructions
echo ========================================
echo.
echo Please follow these steps to deploy your backend:
echo.
echo 1. Go to: https://render.com
echo 2. Sign up/Login with GitHub
echo 3. Click "New +" ^> "Web Service"
echo 4. Connect your GitHub repository
echo 5. Select "donatehub" repository
echo 6. Configure:
echo    - Name: donatehub-backend
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo    - Root Directory: backend
echo 7. Add Environment Variables:
echo    MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true^&w=majority
echo    JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
echo    PORT=5000
echo    NODE_ENV=production
echo 8. Click "Create Web Service"
echo.
echo Step 3: After Backend is Deployed
echo ==================================
echo.
echo 1. Copy your backend URL (e.g., https://donatehub-backend.onrender.com)
echo 2. Go to Vercel Dashboard: https://vercel.com/dashboard
echo 3. Select your DonateHub project
echo 4. Go to Settings ^> Environment Variables
echo 5. Add: REACT_APP_API_URL = your-backend-url
echo 6. Redeploy your frontend
echo.
echo Your DonateHub will be fully deployed!
echo.
pause

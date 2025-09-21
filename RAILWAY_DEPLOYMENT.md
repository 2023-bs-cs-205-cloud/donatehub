# Deploy Backend to Railway

## 🚀 Quick Deployment Steps

### Step 1: Go to Railway
1. Visit: https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"

### Step 2: Connect Repository
1. Connect your GitHub repository
2. Select the `backend` folder as the root directory
3. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables
Add these environment variables in Railway dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatehub
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy
1. Railway will automatically build and deploy
2. You'll get a URL like: `https://donatehub-backend-production.up.railway.app`

### Step 5: Update Frontend API URL
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app/api`
5. Redeploy frontend

## 🔗 Your URLs After Deployment
- **Frontend**: https://donatehub-b773ypgp6-2023-bs-cs-205-5818s-projects.vercel.app
- **Backend**: https://your-railway-url.up.railway.app

## ✅ Test Your Deployment
1. Visit your frontend URL
2. Try to register a new account
3. Try to login
4. Create a campaign
5. Make a donation

Your authentication should now work perfectly!

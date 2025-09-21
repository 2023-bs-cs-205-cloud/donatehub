# 🚀 Deploy Backend to Render (Free)

## ⚡ Quick Setup (No GitHub Required)

### Step 1: Go to Render
1. **Visit**: https://render.com
2. **Sign up** with Google/GitHub
3. **Click**: "New +" → "Web Service"

### Step 2: Connect Your Code
1. **Choose**: "Build and deploy from a Git repository"
2. **Connect**: Your GitHub account (if you have one) OR
3. **Alternative**: Use "Deploy without Git" option

### Step 3: Configure Service
1. **Name**: `donatehub-backend`
2. **Environment**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Root Directory**: `backend` (if deploying from root)

### Step 4: Environment Variables
Add these in Render dashboard:
```
MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy
1. **Click**: "Create Web Service"
2. **Wait**: For deployment to complete
3. **Copy**: Your service URL (e.g., `https://donatehub-backend.onrender.com`)

## 🔄 Alternative: Manual Upload

### Option 1: Zip Upload
1. **Zip** your `backend` folder
2. **Upload** to Render
3. **Configure** as above

### Option 2: GitHub (Recommended)
1. **Create** GitHub repository
2. **Upload** your code
3. **Connect** to Render

## 📋 Quick GitHub Setup (5 minutes)

### Create GitHub Repository
1. **Go to**: https://github.com
2. **Sign up/Login**
3. **Click**: "New repository"
4. **Name**: `donatehub`
5. **Make it Public**
6. **Create repository**

### Upload Your Code
1. **Download**: GitHub Desktop or use web interface
2. **Upload**: Your entire DonateHub folder
3. **Commit**: "Initial commit"
4. **Push**: To GitHub

### Connect to Render
1. **Go to**: Render dashboard
2. **New Web Service**
3. **Connect**: Your GitHub repository
4. **Select**: `donatehub` repository
5. **Root Directory**: `backend`
6. **Configure**: As above

## ✅ After Deployment

### Update Vercel
1. **Go to**: Vercel dashboard
2. **Environment Variables**
3. **Add**: `REACT_APP_API_URL` = `https://your-render-url.onrender.com/api`
4. **Redeploy**

### Test Your App
1. **Visit**: Your Vercel URL
2. **Register**: New account
3. **Login**: Should work now!

## 🎯 Your URLs
- **Frontend**: https://donatehub-b773ypgp6-2023-bs-cs-205-5818s-projects.vercel.app
- **Backend**: https://your-render-url.onrender.com
- **Database**: MongoDB Atlas (cloud)

## 🆘 Need Help?
- **Render Docs**: https://render.com/docs
- **Free Tier**: 750 hours/month
- **Support**: Available in Render dashboard

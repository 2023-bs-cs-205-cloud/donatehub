# MongoDB Atlas Setup Guide

## 🌐 Step 1: Create MongoDB Atlas Account

1. **Go to**: https://cloud.mongodb.com
2. **Sign up** for a free account
3. **Choose**: "Build a new app" → "I'm learning MongoDB"
4. **Select**: Free tier (M0 Sandbox)

## 🏗️ Step 2: Create Cluster

1. **Choose Cloud Provider**: AWS (recommended)
2. **Select Region**: Choose closest to your users
3. **Cluster Name**: `donatehub-cluster`
4. **Click**: "Create Cluster"

## 🔐 Step 3: Create Database User

1. **Go to**: Database Access (left sidebar)
2. **Click**: "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `donatehub-user`
5. **Password**: Generate secure password (save it!)
6. **Database User Privileges**: "Read and write to any database"
7. **Click**: "Add User"

## 🌍 Step 4: Configure Network Access

1. **Go to**: Network Access (left sidebar)
2. **Click**: "Add IP Address"
3. **Choose**: "Allow access from anywhere" (0.0.0.0/0)
4. **Click**: "Confirm"

## 🔗 Step 5: Get Connection String

1. **Go to**: Clusters (left sidebar)
2. **Click**: "Connect" on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**

## 📝 Step 6: Update Your Connection String

Replace the connection string with your credentials:

```
mongodb+srv://donatehub-user:YOUR_PASSWORD@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
```

## 🚀 Step 7: Deploy Backend with Atlas

### Option A: Railway Deployment
1. **Go to**: https://railway.app
2. **Create new project** from GitHub
3. **Set root directory**: `backend`
4. **Add environment variables**:
   ```
   MONGODB_URI=mongodb+srv://donatehub-user:YOUR_PASSWORD@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
   JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
   PORT=5000
   NODE_ENV=production
   ```

### Option B: Render Deployment
1. **Go to**: https://render.com
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
5. **Add environment variables** (same as above)

## 🔄 Step 8: Update Frontend API URL

1. **Go to**: Vercel dashboard
2. **Select**: Your DonateHub project
3. **Go to**: Settings → Environment Variables
4. **Add**: 
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.railway.app/api` (or render.com)
5. **Redeploy**: Go to Deployments → Redeploy

## ✅ Step 9: Test Your Application

1. **Visit**: Your Vercel frontend URL
2. **Try**: Register a new account
3. **Try**: Login with the account
4. **Try**: Create a campaign
5. **Try**: Make a donation

## 🎉 Success!

Your DonateHub application is now fully deployed with:
- ✅ Frontend on Vercel
- ✅ Backend on Railway/Render
- ✅ Database on MongoDB Atlas
- ✅ All data persisted in the cloud

## 🔗 Your Live URLs

- **Frontend**: https://donatehub-b773ypgp6-2023-bs-cs-205-5818s-projects.vercel.app
- **Backend**: https://your-backend-url.railway.app
- **Database**: MongoDB Atlas (cloud)

## 📊 Monitoring

- **MongoDB Atlas**: Monitor database usage and performance
- **Vercel**: Monitor frontend deployments and analytics
- **Railway/Render**: Monitor backend logs and performance

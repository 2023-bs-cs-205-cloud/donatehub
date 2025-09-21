# DonateHub Deployment Guide

## 🚀 Deploy to Vercel (Frontend)

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name: `donatehub-frontend`
   - Directory: `./`
   - Override settings? `N`

### Step 2: Deploy Backend to Railway

1. **Go to Railway.app** and sign up/login
2. **Create new project** from GitHub
3. **Connect your repository**
4. **Add environment variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatehub
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=production
   ```
5. **Deploy from backend directory**

### Step 3: Update Frontend API URL

1. **Get your Railway backend URL** (e.g., `https://donatehub-backend.railway.app`)
2. **Update Vercel environment variables**:
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`

### Step 4: Redeploy Frontend

```bash
cd frontend
vercel --prod
```

## 🌐 Alternative: Deploy Backend to Render

1. **Go to Render.com** and sign up
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: `Node`
5. **Add environment variables** (same as Railway)

## 📋 Environment Variables Needed

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatehub
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## 🔗 Your Deployed URLs

- **Frontend**: `https://donatehub-frontend.vercel.app`
- **Backend**: `https://donatehub-backend.railway.app`

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables configured
- [ ] API URLs updated
- [ ] Test registration/login
- [ ] Test campaign creation
- [ ] Test donations
- [ ] Verify data persistence

## 🎉 You're Live!

Your DonateHub application is now deployed and accessible worldwide!

# 🚀 Deploy Backend to Render (Automatic)

## **Step 1: Go to Render**
1. **Visit**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Click**: "New +" → "Web Service"

## **Step 2: Connect Your Repository**
1. **Select**: "Build and deploy from a Git repository"
2. **Connect**: Your GitHub account
3. **Select**: `donatehub` repository
4. **Click**: "Connect"

## **Step 3: Configure Service**
1. **Name**: `donatehub-backend`
2. **Environment**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Root Directory**: `backend`

## **Step 4: Environment Variables**
Click "Advanced" and add these:
```
MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

## **Step 5: Deploy**
1. **Click**: "Create Web Service"
2. **Wait**: For deployment to complete (5-10 minutes)
3. **Copy**: Your service URL (e.g., `https://donatehub-backend.onrender.com`)

## **Step 6: Update Vercel**
1. **Go to**: Vercel Dashboard
2. **Select**: Your project
3. **Settings** → **Environment Variables**
4. **Add**: `REACT_APP_API_URL` = `https://your-render-url.onrender.com`
5. **Redeploy**

## **Result:**
- **Frontend**: https://your-vercel-url.vercel.app
- **Backend**: https://donatehub-backend.onrender.com
- **Database**: MongoDB Atlas
- **Status**: ✅ Fully deployed!

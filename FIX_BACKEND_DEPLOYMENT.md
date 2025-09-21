# 🔧 Fix Backend Deployment - Step by Step

## ❌ **Current Issue:**
- **Backend URL**: https://donatehub-backend.onrender.com
- **Status**: "Not Found" error
- **Problem**: Backend deployment failed or incorrect configuration

## 🚀 **Solution: Deploy Backend Correctly**

### **Step 1: Go to Render Dashboard**
1. **Visit**: https://render.com
2. **Login** with your GitHub account
3. **Check**: If you have any existing services

### **Step 2: Create New Web Service**
1. **Click**: "New +" → "Web Service"
2. **Connect**: Your GitHub repository
3. **Select**: `donatehub` repository (or `donatehub-frontend` if that's what you have)

### **Step 3: Configure Service Correctly**
1. **Name**: `donatehub-backend`
2. **Environment**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Root Directory**: `backend` ⚠️ **IMPORTANT**

### **Step 4: Environment Variables**
Add these exactly:
```
MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

### **Step 5: Deploy**
1. **Click**: "Create Web Service"
2. **Wait**: 5-10 minutes for deployment
3. **Check**: Build logs for errors

## 🔍 **Common Issues & Solutions:**

### **Issue 1: Wrong Root Directory**
- **Problem**: Root directory not set to `backend`
- **Solution**: Set Root Directory to `backend`

### **Issue 2: Missing Environment Variables**
- **Problem**: MongoDB URI or JWT secret missing
- **Solution**: Add all environment variables

### **Issue 3: Build Command Error**
- **Problem**: `npm install` fails
- **Solution**: Check if `package.json` exists in backend folder

### **Issue 4: Start Command Error**
- **Problem**: `npm start` fails
- **Solution**: Check if `server.js` exists and has correct start script

## 🎯 **Correct Repository Structure for Render:**
```
donatehub/
├── backend/                 # ← Render should use this as root
│   ├── package.json        # ← Must exist
│   ├── server.js           # ← Must exist
│   ├── controllers/
│   ├── models/
│   └── routes/
├── frontend/               # ← Vercel should use this as root
└── README.md
```

## 🚀 **Alternative: Use Railway Instead**

If Render keeps failing, try Railway:

### **Railway Deployment:**
1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **New Project** → "Deploy from GitHub repo"
4. **Select**: Your repository
5. **Root Directory**: `backend`
6. **Environment Variables**: Same as above
7. **Deploy**

## 📋 **Checklist for Successful Deployment:**

- [ ] Repository has `backend` folder
- [ ] `backend/package.json` exists
- [ ] `backend/server.js` exists
- [ ] Root directory set to `backend`
- [ ] Environment variables added
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Deployment successful (green status)

## 🎉 **After Successful Deployment:**

1. **Copy** your backend URL (e.g., `https://donatehub-backend.onrender.com`)
2. **Update** Vercel environment variables:
   - `REACT_APP_API_URL` = `your-backend-url`
3. **Redeploy** frontend
4. **Test** your app

## 🆘 **Still Having Issues?**

### **Check Your Repository:**
1. **Go to**: https://github.com/your-username/donatehub
2. **Verify**: `backend` folder exists
3. **Check**: `backend/package.json` and `backend/server.js`

### **Try Different Platform:**
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **DigitalOcean**: https://digitalocean.com

**The key is setting the Root Directory to `backend` in Render!** 🎯

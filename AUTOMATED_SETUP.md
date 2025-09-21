# 🚀 Automated DonateHub Cloud Setup

## ⚡ Quick Setup (5 Minutes)

### Step 1: MongoDB Atlas (2 minutes)
1. **Click**: https://cloud.mongodb.com
2. **Sign up** with Google/GitHub (faster)
3. **Create Project**: "DonateHub"
4. **Build Database** → **Free** → **Create**
5. **Username**: `donatehub`
6. **Password**: `DonateHub2024!` (save this!)
7. **Network Access** → **Add IP Address** → **Allow access from anywhere**
8. **Connect** → **Connect your application** → **Copy connection string**

### Step 2: Railway Backend (2 minutes)
1. **Click**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: Your DonateHub repository
5. **Root Directory**: `backend`
6. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@cluster0.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
   JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
   PORT=5000
   NODE_ENV=production
   ```
7. **Deploy** → Copy the URL (e.g., `https://donatehub-backend-production.up.railway.app`)

### Step 3: Update Vercel (1 minute)
1. **Click**: https://vercel.com/dashboard
2. **Select**: Your DonateHub project
3. **Settings** → **Environment Variables**
4. **Add**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-railway-url.up.railway.app/api`
5. **Redeploy** → **Deployments** → **Redeploy**

## 🎯 Exact Connection String Format
Replace `xxxxx` with your actual cluster ID:
```
mongodb+srv://donatehub:DonateHub2024!@cluster0.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
```

## ✅ Test Your Setup
1. **Visit**: Your Vercel URL
2. **Register**: New account
3. **Login**: Should work now!
4. **Create**: Campaign
5. **Make**: Donation

## 🔗 Your Live URLs
- **Frontend**: https://donatehub-b773ypgp6-2023-bs-cs-205-5818s-projects.vercel.app
- **Backend**: https://your-railway-url.up.railway.app
- **Database**: MongoDB Atlas (cloud)

## 🆘 If You Get Stuck
1. **MongoDB Atlas**: Make sure IP is 0.0.0.0/0
2. **Railway**: Check environment variables are correct
3. **Vercel**: Make sure REACT_APP_API_URL is set
4. **Test**: Try the health check: `https://your-railway-url.up.railway.app/api/health`

## 🎉 Success!
Your DonateHub will be fully functional with cloud database!

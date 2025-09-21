# ✅ DonateHub Cloud Setup Checklist

## 📋 Quick Checklist (Copy & Paste Ready)

### 1. MongoDB Atlas Setup
- [ ] Go to: https://cloud.mongodb.com
- [ ] Sign up with Google/GitHub
- [ ] Create project: "DonateHub"
- [ ] Build database → Free tier
- [ ] Username: `donatehub`
- [ ] Password: `DonateHub2024!`
- [ ] Network access: Allow from anywhere (0.0.0.0/0)
- [ ] Copy connection string

### 2. Railway Backend Deployment
- [ ] Go to: https://railway.app
- [ ] Login with GitHub
- [ ] New project → Deploy from GitHub
- [ ] Select your repository
- [ ] Root directory: `backend`
- [ ] Add environment variables:
  ```
  MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@cluster0.xxxxx.mongodb.net/donatehub?retryWrites=true&w=majority
  JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
  PORT=5000
  NODE_ENV=production
  ```
- [ ] Deploy and copy URL

### 3. Update Vercel Frontend
- [ ] Go to: https://vercel.com/dashboard
- [ ] Select your project
- [ ] Settings → Environment Variables
- [ ] Add: `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app/api`
- [ ] Redeploy

### 4. Test Everything
- [ ] Visit your Vercel URL
- [ ] Register new account
- [ ] Login
- [ ] Create campaign
- [ ] Make donation

## 🎯 Expected Results
- ✅ Authentication works
- ✅ Data persists
- ✅ No more "login failed" errors
- ✅ Fully functional app

## 📞 Need Help?
Follow the detailed guide in `AUTOMATED_SETUP.md`

# 📚 Repository Setup Guide for DonateHub

## 🔍 **Current Situation:**
- **Current Repository**: `donatehub-frontend` (incorrect name)
- **Should Be**: `donatehub` (contains both frontend and backend)
- **Your Project**: Full-stack MERN application

## 🎯 **Correct Repository Structure:**

### **Option 1: Rename Current Repository (Recommended)**
1. **Go to**: https://github.com/2023-bs-cs-205-cloud/donatehub-frontend
2. **Click**: Settings (top right)
3. **Scroll down**: To "Repository name"
4. **Change**: `donatehub-frontend` → `donatehub`
5. **Click**: "Rename"

### **Option 2: Create New Repository**
1. **Go to**: https://github.com/2023-bs-cs-205-cloud
2. **Click**: "New repository"
3. **Name**: `donatehub`
4. **Description**: "DonateHub - Charity & Donation Management System"
5. **Make it Public**
6. **Don't initialize** (you already have code)

## 🚀 **After Repository Setup:**

### **If you renamed the repository:**
```bash
# Update remote URL
git remote set-url origin https://github.com/2023-bs-cs-205-cloud/donatehub.git

# Push to new URL
git push origin main
```

### **If you created a new repository:**
```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/2023-bs-cs-205-cloud/donatehub.git

# Push to new repository
git push -u origin main
```

## 📁 **Your Repository Should Contain:**
```
donatehub/
├── backend/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
├── DEPLOYMENT_STEPS.md    # Deployment guide
└── ... (other files)
```

## 🎯 **Recommended Action:**

### **Step 1: Rename Repository**
1. **Go to**: https://github.com/2023-bs-cs-205-cloud/donatehub-frontend/settings
2. **Change name**: `donatehub-frontend` → `donatehub`
3. **Click**: "Rename"

### **Step 2: Update Local Repository**
```bash
# Update remote URL
git remote set-url origin https://github.com/2023-bs-cs-205-cloud/donatehub.git

# Verify
git remote -v

# Push to confirm
git push origin main
```

## ✅ **Final Result:**
- **Repository Name**: `donatehub`
- **URL**: https://github.com/2023-bs-cs-205-cloud/donatehub
- **Contains**: Both frontend and backend
- **Status**: ✅ Ready for deployment

## 🚀 **For Deployment:**
- **Render**: Use `donatehub` repository, root directory `backend`
- **Vercel**: Use `donatehub` repository, root directory `frontend`

**The correct repository name should be `donatehub` (not `donatehub-frontend`)** 🎯

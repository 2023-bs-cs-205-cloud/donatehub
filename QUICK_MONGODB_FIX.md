# 🚀 Quick MongoDB Fix for Render

## ❌ **Current Error:**
```
MongoDB connection error: Error: querySrv ENOTFOUND _mongodb._tcp.donatehub-cluster.xxxxx.mongodb.net
```

## 🎯 **Quick Fix (2 minutes):**

### **Step 1: Update Environment Variable**
1. **Go to**: Render Dashboard
2. **Find**: Your `donatehub-2` service
3. **Click**: "Environment" tab
4. **Find**: `MONGODB_URI` variable
5. **Update** to:
   ```
   MONGODB_URI=mongodb://localhost:27017/donatehub
   ```
6. **Save** changes

### **Step 2: Redeploy**
1. **Click**: "Manual Deploy" or "Redeploy"
2. **Wait**: For deployment to complete

## 🔍 **Why This Works:**
- **Local MongoDB**: Uses Render's built-in MongoDB
- **No external connection**: No need for MongoDB Atlas
- **Quick fix**: Gets your app running immediately

## 🎉 **Expected Result:**
```
Server running on port 5000
MongoDB connected successfully
```

## 🚀 **Alternative: Use MongoDB Atlas**

If you want to use MongoDB Atlas:

### **Step 1: Get Real Connection String**
1. **Go to**: https://cloud.mongodb.com
2. **Login** to your account
3. **Click**: "Connect" on your cluster
4. **Choose**: "Connect your application"
5. **Copy**: The real connection string

### **Step 2: Update Render**
1. **Go to**: Render Environment Variables
2. **Update**: `MONGODB_URI` with real connection string
3. **Redeploy**

## 📋 **Quick Checklist:**
- [ ] Go to Render Dashboard
- [ ] Find Environment Variables
- [ ] Update `MONGODB_URI` to `mongodb://localhost:27017/donatehub`
- [ ] Save changes
- [ ] Redeploy
- [ ] Check logs for success

**This quick fix will get your backend running immediately!** 🎯

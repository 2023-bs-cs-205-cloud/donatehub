# 🗄️ MongoDB Atlas Setup - Complete Guide

## 🎯 **Why MongoDB Atlas?**
- **Free tier**: 512MB storage
- **Cloud hosted**: No local setup needed
- **Reliable**: 99.95% uptime
- **Secure**: Built-in security features

## 🚀 **Step-by-Step Setup:**

### **Step 1: Create MongoDB Atlas Account**
1. **Go to**: https://cloud.mongodb.com
2. **Click**: "Try Free"
3. **Sign up** with Google/GitHub/Email
4. **Verify** your email

### **Step 2: Create Cluster**
1. **Choose**: "Shared" (Free tier)
2. **Provider**: AWS
3. **Region**: Choose closest to you
4. **Cluster Name**: `donatehub-cluster`
5. **Click**: "Create Cluster"

### **Step 3: Create Database User**
1. **Go to**: Database Access
2. **Click**: "Add New Database User"
3. **Username**: `donatehub`
4. **Password**: `DonateHub2024!`
5. **Database User Privileges**: "Read and write to any database"
6. **Click**: "Add User"

### **Step 4: Whitelist IP Addresses**
1. **Go to**: Network Access
2. **Click**: "Add IP Address"
3. **Choose**: "Allow access from anywhere" (0.0.0.0/0)
4. **Click**: "Confirm"

### **Step 5: Get Connection String**
1. **Go to**: Clusters
2. **Click**: "Connect" on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy**: Connection string

### **Step 6: Update Connection String**
Replace `<password>` with your actual password:

```
mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.abc123.mongodb.net/donatehub?retryWrites=true&w=majority
```

## 🔧 **Update Render Environment Variables:**

### **Go to Render Dashboard:**
1. **Find**: Your service
2. **Click**: Environment tab
3. **Update**: `MONGODB_URI` with your real connection string
4. **Save** changes

### **Environment Variables:**
```
MONGODB_URI=mongodb+srv://donatehub:DonateHub2024!@donatehub-cluster.abc123.mongodb.net/donatehub?retryWrites=true&w=majority
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

## 🎉 **Expected Result:**
```
Attempting to connect to MongoDB...
MongoDB connected successfully
Server running on port 5000
Health check: http://localhost:5000/api/health
```

## 🔍 **Troubleshooting:**

### **Common Issues:**
1. **Wrong password**: Make sure password matches
2. **IP not whitelisted**: Add 0.0.0.0/0 to Network Access
3. **Wrong connection string**: Use the exact string from Atlas

### **Test Connection:**
1. **Go to**: MongoDB Atlas
2. **Click**: "Connect" → "MongoDB Compass"
3. **Test**: Connection string

## 📋 **Quick Checklist:**
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Create database user
- [ ] Whitelist IP addresses
- [ ] Get connection string
- [ ] Update Render environment variables
- [ ] Redeploy service

**Follow this guide to set up MongoDB Atlas and fix your Bad Gateway error!** 🚀

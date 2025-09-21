# 🔧 Fix Bad Gateway Error - Complete Solution

## ❌ **Current Issues:**
- **Bad Gateway**: Service unavailable
- **Instance failed**: Exited with status 1
- **Free tier limitations**: Spinning down with inactivity

## 🎯 **Root Causes:**
1. **MongoDB connection issues**
2. **Free tier limitations**
3. **Service configuration problems**
4. **Environment variables not properly set**

## 🚀 **Complete Solution:**

### **Step 1: Fix MongoDB Connection**
The current MongoDB URI `mongodb://localhost:27017/donatehub` won't work on Render because there's no local MongoDB.

#### **Option A: Use MongoDB Atlas (Recommended)**
1. **Go to**: https://cloud.mongodb.com
2. **Create**: Free cluster
3. **Get**: Connection string
4. **Update**: Render environment variables

#### **Option B: Use Render's Built-in MongoDB**
1. **Go to**: Render Dashboard
2. **Create**: New MongoDB service
3. **Connect**: To your backend service

### **Step 2: Update Environment Variables**
Go to Render → Environment Variables and set:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donatehub?retryWrites=true&w=majority
JWT_SECRET=donatehub_super_secret_jwt_key_2024_secure_token_production
PORT=5000
NODE_ENV=production
```

### **Step 3: Fix Server Configuration**
Update your `server.js` to handle Render's requirements:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with retry logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **Step 4: Update package.json**
Ensure your `package.json` has the correct start script:

```json
{
  "name": "donatehub-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1"
  }
}
```

### **Step 5: Add Health Check**
Create a health check endpoint to monitor service status.

### **Step 6: Redeploy with Fixed Configuration**
1. **Commit**: All changes to GitHub
2. **Redeploy**: On Render
3. **Monitor**: Logs for successful startup

## 🔍 **Troubleshooting Steps:**

### **Check Logs:**
1. **Go to**: Render Dashboard
2. **Click**: "Logs" tab
3. **Look for**: Error messages
4. **Common errors**:
   - MongoDB connection failed
   - Port binding issues
   - Missing environment variables

### **Verify Environment Variables:**
- `MONGODB_URI`: Must be valid MongoDB connection string
- `JWT_SECRET`: Must be set
- `PORT`: Should be 5000 or let Render set it
- `NODE_ENV`: Should be production

### **Test Locally:**
```bash
cd backend
npm install
npm start
```

## 🚀 **Alternative: Use Railway Instead**

If Render keeps failing, try Railway:

### **Railway Deployment:**
1. **Go to**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select**: `donatehub` repository
4. **Root Directory**: `backend`
5. **Add**: Environment variables
6. **Deploy**

## 📋 **Best Practices Checklist:**

- [ ] Use MongoDB Atlas (not localhost)
- [ ] Add health check endpoint
- [ ] Implement proper error handling
- [ ] Use environment variables
- [ ] Add retry logic for database connection
- [ ] Monitor logs regularly
- [ ] Test locally before deploying

## 🎯 **Quick Fix Commands:**

```bash
# Update server.js with proper configuration
# Add health check endpoint
# Update environment variables
# Redeploy service
```

**Follow this complete solution to fix your Bad Gateway error!** 🚀

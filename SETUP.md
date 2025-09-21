# DonateHub Setup Guide

This guide will help you set up and run the DonateHub application locally.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/donatehub
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

#### Frontend Environment
Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp env.example .env
```

The default frontend environment is already configured to connect to the backend.

### 3. Database Setup

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the connection string in your `.env` file.

### 4. Seed Demo Data (Optional)

To populate the database with demo data:

```bash
cd backend
npm run seed
```

This will create:
- Demo NGO and Donor accounts
- Sample campaigns
- Sample donations

**Demo Accounts:**
- NGO: `ngo@demo.com` / `password123`
- Donor: `donor@demo.com` / `password123`
- Health Foundation: `health@demo.com` / `password123`
- Education Trust: `education@demo.com` / `password123`

### 5. Start the Application

#### Option 1: Start Both Frontend and Backend (Recommended)
From the root directory:

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

#### Option 2: Start Separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## Project Structure

```
DonateHub/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── scripts/        # Database scripts
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
│   └── package.json
└── package.json        # Root package.json
```

## Features Implemented

### ✅ Completed Features

1. **Authentication System**
   - JWT-based authentication
   - Role-based access (NGO/Donor)
   - Password hashing with bcrypt
   - Protected routes

2. **Backend API**
   - User registration and login
   - Campaign CRUD operations
   - Donation management
   - Statistics and analytics

3. **Frontend**
   - Responsive design with Tailwind CSS
   - Authentication context
   - Protected routes
   - Campaign browsing
   - User dashboards (basic structure)

4. **Database Models**
   - User schema with roles
   - Campaign schema with categories
   - Donation schema with tracking

### 🚧 In Progress / To Be Implemented

1. **Campaign Management**
   - Full campaign creation form
   - Campaign editing and deletion
   - Image upload functionality

2. **Donation System**
   - Complete donation flow
   - Payment integration (mock)
   - Donation history

3. **Dashboard Features**
   - NGO analytics dashboard
   - Donor donation history
   - Campaign progress tracking

4. **Additional Features**
   - Real-time notifications
   - Email notifications
   - Advanced search and filtering
   - Campaign sharing

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Campaigns
- `GET /api/campaigns` - Get all campaigns (with filters)
- `GET /api/campaigns/:id` - Get single campaign
- `POST /api/campaigns` - Create campaign (NGO only)
- `PUT /api/campaigns/:id` - Update campaign (NGO only)
- `DELETE /api/campaigns/:id` - Delete campaign (NGO only)
- `GET /api/campaigns/ngo/my-campaigns` - Get NGO's campaigns

### Donations
- `POST /api/donations` - Make donation (Donor only)
- `GET /api/donations/my-donations` - Get donor's donations
- `GET /api/donations/ngo/all` - Get all donations for NGO
- `GET /api/donations/campaign/:campaignId` - Get campaign donations
- `GET /api/donations/stats` - Get donation statistics

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file
   - Verify database permissions

2. **Port Already in Use**
   - Change PORT in backend `.env` file
   - Kill existing processes on ports 3000/5000

3. **CORS Issues**
   - Backend CORS is configured for localhost:3000
   - Update CORS settings for production

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`

### Development Tips

1. **Database Reset**
   ```bash
   cd backend
   npm run seed
   ```

2. **View API Documentation**
   - Visit http://localhost:5000/api/health for basic API check
   - Use browser dev tools to inspect API calls

3. **Frontend Development**
   - Hot reload is enabled
   - Check browser console for errors
   - Use React DevTools for debugging

## Next Steps

1. Implement remaining dashboard features
2. Add campaign creation and editing forms
3. Complete donation flow
4. Add image upload functionality
5. Implement real-time features
6. Add email notifications
7. Deploy to production

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Ensure all dependencies are installed
4. Verify environment configuration

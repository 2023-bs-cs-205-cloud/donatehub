# DonateHub - Charity & Donation Management System

A comprehensive MERN-based platform that connects NGOs and donors by providing a digital space for campaign management, donations, and transparency.

## 🚀 Features

### Authentication & Roles
- JWT-based login/signup with NGO and Donor roles
- bcrypt password hashing
- Role-based access control

### NGO Features
- Create, edit, delete campaigns
- Campaign management dashboard
- Track donations and progress

### Donor Features
- Browse campaigns with filters and search
- Make donations (mock payments)
- Personal donation history dashboard

### Campaign Management
- Progress tracking with visual indicators
- Campaign status management (active/closed)
- Category-based organization

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📊 Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["ngo", "donor"], default: "donor" },
  createdAt: Date
}
```

### Campaign Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: { type: String, enum: ["health", "education", "disaster", "others"] },
  goalAmount: Number,
  raisedAmount: { type: Number, default: 0 },
  createdBy: { type: ObjectId, ref: "User" },
  createdAt: Date,
  status: { type: String, enum: ["active", "closed"], default: "active" }
}
```

### Donation Schema
```javascript
{
  _id: ObjectId,
  donorId: ObjectId,
  campaignId: ObjectId,
  amount: Number,
  donatedAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd DonateHub
```

2. Install dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the development server
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
DonateHub/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

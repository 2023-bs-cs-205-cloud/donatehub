const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        message: 'DonateHub API is running!'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Connect to MongoDB with retry logic
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/donatehub';
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

// Start server only after MongoDB connection
const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the application
startServer();

module.exports = app;
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        message: 'DonateHub API is running!',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});

// Test route for campaigns
app.get('/api/campaigns', (req, res) => {
    res.json({
        campaigns: [{
            _id: '1',
            title: 'Test Campaign',
            description: 'This is a test campaign',
            category: 'health',
            goalAmount: 10000,
            raisedAmount: 5000,
            progressPercentage: 50,
            createdBy: {
                name: 'Test NGO'
            },
            createdAt: new Date().toISOString(),
            status: 'active'
        }],
        pagination: {
            current: 1,
            pages: 1,
            total: 1
        }
    });
});

// Test route for donation stats
app.get('/api/donations/stats', (req, res) => {
    res.json({
        stats: {
            totalDonations: 100,
            totalAmount: 50000,
            averageAmount: 500
        },
        recentDonations: []
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
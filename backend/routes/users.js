const express = require('express');
const User = require('../models/User');
const {
    authenticateToken
} = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only - for future use)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({
            createdAt: -1
        });
        res.json({
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([{
            $group: {
                _id: '$role',
                count: {
                    $sum: 1
                }
            }
        }]);

        const totalUsers = await User.countDocuments();
        const ngoCount = stats.find(stat => stat._id === 'ngo') ? .count || 0;
        const donorCount = stats.find(stat => stat._id === 'donor') ? .count || 0;

        res.json({
            totalUsers,
            ngoCount,
            donorCount,
            stats
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Routes
router.get('/stats', getUserStats);
router.get('/all', authenticateToken, getAllUsers);

module.exports = router;
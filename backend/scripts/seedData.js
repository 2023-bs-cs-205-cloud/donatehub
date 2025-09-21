const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/donatehub');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed data
const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Campaign.deleteMany({});
        await Donation.deleteMany({});

        console.log('Cleared existing data');

        // Create demo users
        const demoUsers = [{
                name: 'Demo NGO',
                email: 'ngo@demo.com',
                password: 'password123',
                role: 'ngo'
            },
            {
                name: 'Demo Donor',
                email: 'donor@demo.com',
                password: 'password123',
                role: 'donor'
            },
            {
                name: 'Health Foundation',
                email: 'health@demo.com',
                password: 'password123',
                role: 'ngo'
            },
            {
                name: 'Education Trust',
                email: 'education@demo.com',
                password: 'password123',
                role: 'ngo'
            }
        ];

        const users = await User.insertMany(demoUsers);
        console.log('Created demo users');

        // Create demo campaigns
        const demoCampaigns = [{
                title: 'Emergency Medical Fund',
                description: 'Help us provide emergency medical care to families in need. Your donation will directly support medical supplies, equipment, and treatment for those who cannot afford healthcare.',
                category: 'health',
                goalAmount: 50000,
                raisedAmount: 25000,
                createdBy: users[0]._id
            },
            {
                title: 'School Supplies for Children',
                description: 'Support education by providing essential school supplies to underprivileged children. Every donation helps a child access quality education.',
                category: 'education',
                goalAmount: 15000,
                raisedAmount: 8500,
                createdBy: users[2]._id
            },
            {
                title: 'Disaster Relief Fund',
                description: 'Help communities affected by natural disasters rebuild their lives. Your support provides food, shelter, and essential supplies.',
                category: 'disaster',
                goalAmount: 100000,
                raisedAmount: 45000,
                createdBy: users[0]._id
            },
            {
                title: 'Clean Water Initiative',
                description: 'Bring clean, safe drinking water to rural communities. Help us install water purification systems and wells.',
                category: 'others',
                goalAmount: 30000,
                raisedAmount: 12000,
                createdBy: users[3]._id
            },
            {
                title: 'Digital Learning Program',
                description: 'Provide tablets and internet access to students for online learning. Bridge the digital divide in education.',
                category: 'education',
                goalAmount: 25000,
                raisedAmount: 18000,
                createdBy: users[3]._id
            },
            {
                title: 'Mental Health Support',
                description: 'Support mental health services for vulnerable populations. Provide counseling and therapy sessions.',
                category: 'health',
                goalAmount: 20000,
                raisedAmount: 5000,
                createdBy: users[2]._id
            }
        ];

        const campaigns = await Campaign.insertMany(demoCampaigns);
        console.log('Created demo campaigns');

        // Create demo donations
        const demoDonations = [{
                donorId: users[1]._id,
                campaignId: campaigns[0]._id,
                amount: 100,
                donatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            },
            {
                donorId: users[1]._id,
                campaignId: campaigns[1]._id,
                amount: 50,
                donatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
                donorId: users[1]._id,
                campaignId: campaigns[2]._id,
                amount: 200,
                donatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            },
            {
                donorId: users[1]._id,
                campaignId: campaigns[0]._id,
                amount: 75,
                donatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        ];

        await Donation.insertMany(demoDonations);
        console.log('Created demo donations');

        console.log('\n✅ Demo data seeded successfully!');
        console.log('\nDemo Accounts:');
        console.log('NGO: ngo@demo.com / password123');
        console.log('Donor: donor@demo.com / password123');
        console.log('Health Foundation: health@demo.com / password123');
        console.log('Education Trust: education@demo.com / password123');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seed function
connectDB().then(() => {
    seedData();
});
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Donation amount is required'],
        min: [1, 'Donation amount must be at least 1']
    },
    donatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'bank_transfer'],
        default: 'card'
    },
    transactionId: {
        type: String,
        default: function() {
            return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
    }
});

// Index for better query performance
donationSchema.index({
    donorId: 1,
    donatedAt: -1
});
donationSchema.index({
    campaignId: 1,
    donatedAt: -1
});
donationSchema.index({
    donatedAt: -1
});

// Virtual for donor name (populated)
donationSchema.virtual('donor', {
    ref: 'User',
    localField: 'donorId',
    foreignField: '_id',
    justOne: true
});

// Virtual for campaign details (populated)
donationSchema.virtual('campaign', {
    ref: 'Campaign',
    localField: 'campaignId',
    foreignField: '_id',
    justOne: true
});

// Ensure virtual fields are serialized
donationSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Donation', donationSchema);
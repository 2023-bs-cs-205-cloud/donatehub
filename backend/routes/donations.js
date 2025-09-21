const express = require('express');
const {
    body
} = require('express-validator');
const {
    makeDonation,
    getDonorDonations,
    getCampaignDonations,
    getNgoDonations,
    getDonationStats
} = require('../controllers/donationController');
const {
    authenticateToken,
    requireNGO,
    requireDonor
} = require('../middleware/auth');

const router = express.Router();

// Validation rules
const donationValidation = [
    body('campaignId')
    .isMongoId()
    .withMessage('Valid campaign ID is required'),
    body('amount')
    .isNumeric()
    .isFloat({
        min: 1
    })
    .withMessage('Amount must be a positive number'),
    body('paymentMethod')
    .optional()
    .isIn(['card', 'paypal', 'bank_transfer'])
    .withMessage('Payment method must be one of: card, paypal, bank_transfer')
];

// Public routes
router.get('/stats', getDonationStats);

// Donor routes (authenticated)
router.post('/', authenticateToken, requireDonor, donationValidation, makeDonation);
router.get('/my-donations', authenticateToken, requireDonor, getDonorDonations);

// NGO routes (authenticated)
router.get('/ngo/all', authenticateToken, requireNGO, getNgoDonations);
router.get('/campaign/:campaignId', authenticateToken, requireNGO, getCampaignDonations);

module.exports = router;
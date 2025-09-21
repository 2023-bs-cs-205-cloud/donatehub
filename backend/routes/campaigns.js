const express = require('express');
const {
    body
} = require('express-validator');
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getNgoCampaigns
} = require('../controllers/campaignController');
const {
    authenticateToken,
    requireNGO,
    optionalAuth
} = require('../middleware/auth');

const router = express.Router();

// Validation rules
const campaignValidation = [
    body('title')
    .trim()
    .isLength({
        min: 5,
        max: 100
    })
    .withMessage('Title must be between 5 and 100 characters'),
    body('description')
    .trim()
    .isLength({
        min: 20,
        max: 1000
    })
    .withMessage('Description must be between 20 and 1000 characters'),
    body('category')
    .isIn(['health', 'education', 'disaster', 'others'])
    .withMessage('Category must be one of: health, education, disaster, others'),
    body('goalAmount')
    .isNumeric()
    .isFloat({
        min: 1
    })
    .withMessage('Goal amount must be a positive number')
];

const updateCampaignValidation = [
    body('title')
    .optional()
    .trim()
    .isLength({
        min: 5,
        max: 100
    })
    .withMessage('Title must be between 5 and 100 characters'),
    body('description')
    .optional()
    .trim()
    .isLength({
        min: 20,
        max: 1000
    })
    .withMessage('Description must be between 20 and 1000 characters'),
    body('category')
    .optional()
    .isIn(['health', 'education', 'disaster', 'others'])
    .withMessage('Category must be one of: health, education, disaster, others'),
    body('goalAmount')
    .optional()
    .isNumeric()
    .isFloat({
        min: 1
    })
    .withMessage('Goal amount must be a positive number'),
    body('status')
    .optional()
    .isIn(['active', 'closed'])
    .withMessage('Status must be either active or closed')
];

// Public routes
router.get('/', optionalAuth, getCampaigns);
router.get('/:id', optionalAuth, getCampaign);

// NGO routes (authenticated)
router.post('/', authenticateToken, requireNGO, campaignValidation, createCampaign);
router.get('/ngo/my-campaigns', authenticateToken, requireNGO, getNgoCampaigns);
router.put('/:id', authenticateToken, requireNGO, updateCampaignValidation, updateCampaign);
router.delete('/:id', authenticateToken, requireNGO, deleteCampaign);

module.exports = router;
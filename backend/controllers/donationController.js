const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const {
    validationResult
} = require('express-validator');

// Make a donation
const makeDonation = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            campaignId,
            amount,
            paymentMethod = 'card'
        } = req.body;
        const donorId = req.user._id;

        // Check if campaign exists and is active
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        if (campaign.status !== 'active') {
            return res.status(400).json({
                message: 'Campaign is not active'
            });
        }

        // Create donation
        const donation = new Donation({
            donorId,
            campaignId,
            amount,
            paymentMethod,
            status: 'completed' // Mock payment - always successful
        });

        await donation.save();

        // Update campaign raised amount
        await Campaign.findByIdAndUpdate(
            campaignId, {
                $inc: {
                    raisedAmount: amount
                }
            }
        );

        // Populate donation with campaign and donor details
        await donation.populate([{
                path: 'campaignId',
                select: 'title'
            },
            {
                path: 'donorId',
                select: 'name'
            }
        ]);

        res.status(201).json({
            message: 'Donation successful',
            donation
        });
    } catch (error) {
        console.error('Make donation error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get donor's donation history
const getDonorDonations = async (req, res) => {
    try {
        const {
            page = 1, limit = 10
        } = req.query;
        const donorId = req.user._id;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get donations with pagination
        const donations = await Donation.find({
                donorId
            })
            .populate('campaignId', 'title category status')
            .sort({
                donatedAt: -1
            })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Donation.countDocuments({
            donorId
        });

        // Get donation statistics
        const stats = await Donation.aggregate([{
                $match: {
                    donorId: req.user._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalDonations: {
                        $sum: 1
                    },
                    totalAmount: {
                        $sum: '$amount'
                    },
                    averageAmount: {
                        $avg: '$amount'
                    }
                }
            }
        ]);

        res.json({
            donations,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            },
            stats: stats[0] || {
                totalDonations: 0,
                totalAmount: 0,
                averageAmount: 0
            }
        });
    } catch (error) {
        console.error('Get donor donations error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get donations for a specific campaign (NGO only)
const getCampaignDonations = async (req, res) => {
    try {
        const {
            campaignId
        } = req.params;
        const {
            page = 1, limit = 20
        } = req.query;

        // Verify campaign ownership
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        if (campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to view these donations'
            });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get donations with pagination
        const donations = await Donation.find({
                campaignId
            })
            .populate('donorId', 'name email')
            .sort({
                donatedAt: -1
            })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Donation.countDocuments({
            campaignId
        });

        // Get donation statistics
        const stats = await Donation.aggregate([{
                $match: {
                    campaignId: campaign._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalDonations: {
                        $sum: 1
                    },
                    totalAmount: {
                        $sum: '$amount'
                    },
                    averageAmount: {
                        $avg: '$amount'
                    }
                }
            }
        ]);

        res.json({
            donations,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            },
            stats: stats[0] || {
                totalDonations: 0,
                totalAmount: 0,
                averageAmount: 0
            }
        });
    } catch (error) {
        console.error('Get campaign donations error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get all donations for NGO (across all their campaigns)
const getNgoDonations = async (req, res) => {
    try {
        const {
            page = 1, limit = 20
        } = req.query;

        // Get all campaigns created by this NGO
        const campaigns = await Campaign.find({
            createdBy: req.user._id
        }).select('_id');
        const campaignIds = campaigns.map(campaign => campaign._id);

        if (campaignIds.length === 0) {
            return res.json({
                donations: [],
                pagination: {
                    current: 1,
                    pages: 0,
                    total: 0
                },
                stats: {
                    totalDonations: 0,
                    totalAmount: 0,
                    averageAmount: 0
                }
            });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get donations with pagination
        const donations = await Donation.find({
                campaignId: {
                    $in: campaignIds
                }
            })
            .populate('donorId', 'name email')
            .populate('campaignId', 'title')
            .sort({
                donatedAt: -1
            })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Donation.countDocuments({
            campaignId: {
                $in: campaignIds
            }
        });

        // Get donation statistics
        const stats = await Donation.aggregate([{
                $match: {
                    campaignId: {
                        $in: campaignIds
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDonations: {
                        $sum: 1
                    },
                    totalAmount: {
                        $sum: '$amount'
                    },
                    averageAmount: {
                        $avg: '$amount'
                    }
                }
            }
        ]);

        res.json({
            donations,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            },
            stats: stats[0] || {
                totalDonations: 0,
                totalAmount: 0,
                averageAmount: 0
            }
        });
    } catch (error) {
        console.error('Get NGO donations error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get donation statistics (public)
const getDonationStats = async (req, res) => {
    try {
        const stats = await Donation.aggregate([{
            $group: {
                _id: null,
                totalDonations: {
                    $sum: 1
                },
                totalAmount: {
                    $sum: '$amount'
                },
                averageAmount: {
                    $avg: '$amount'
                }
            }
        }]);

        // Get recent donations
        const recentDonations = await Donation.find()
            .populate('donorId', 'name')
            .populate('campaignId', 'title')
            .sort({
                donatedAt: -1
            })
            .limit(5);

        res.json({
            stats: stats[0] || {
                totalDonations: 0,
                totalAmount: 0,
                averageAmount: 0
            },
            recentDonations
        });
    } catch (error) {
        console.error('Get donation stats error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    makeDonation,
    getDonorDonations,
    getCampaignDonations,
    getNgoDonations,
    getDonationStats
};
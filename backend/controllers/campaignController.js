const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const {
    validationResult
} = require('express-validator');

// Get all campaigns with filters
const getCampaigns = async (req, res) => {
    try {
        const {
            category,
            status,
            search,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (search) {
            filter.$or = [{
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get campaigns with pagination
        const campaigns = await Campaign.find(filter)
            .populate('createdBy', 'name email')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Campaign.countDocuments(filter);

        res.json({
            campaigns,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get single campaign
const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        // Get recent donations for this campaign
        const recentDonations = await Donation.find({
                campaignId: req.params.id
            })
            .populate('donorId', 'name')
            .sort({
                donatedAt: -1
            })
            .limit(10);

        res.json({
            campaign,
            recentDonations
        });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Create new campaign (NGO only)
const createCampaign = async (req, res) => {
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
            title,
            description,
            category,
            goalAmount
        } = req.body;

        const campaign = new Campaign({
            title,
            description,
            category,
            goalAmount,
            createdBy: req.user._id
        });

        await campaign.save();
        await campaign.populate('createdBy', 'name email');

        res.status(201).json({
            message: 'Campaign created successfully',
            campaign
        });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Update campaign (NGO only - owner only)
const updateCampaign = async (req, res) => {
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
            title,
            description,
            category,
            goalAmount,
            status
        } = req.body;
        const campaignId = req.params.id;

        // Find campaign and check ownership
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        if (campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to update this campaign'
            });
        }

        // Update campaign
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            campaignId, {
                title,
                description,
                category,
                goalAmount,
                status
            }, {
                new: true,
                runValidators: true
            }
        ).populate('createdBy', 'name email');

        res.json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign
        });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Delete campaign (NGO only - owner only)
const deleteCampaign = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Find campaign and check ownership
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        if (campaign.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to delete this campaign'
            });
        }

        // Delete associated donations
        await Donation.deleteMany({
            campaignId
        });

        // Delete campaign
        await Campaign.findByIdAndDelete(campaignId);

        res.json({
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Get campaigns by NGO
const getNgoCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({
                createdBy: req.user._id
            })
            .populate('createdBy', 'name email')
            .sort({
                createdAt: -1
            });

        // Get donation statistics for each campaign
        const campaignsWithStats = await Promise.all(
            campaigns.map(async (campaign) => {
                const donationCount = await Donation.countDocuments({
                    campaignId: campaign._id
                });
                const totalRaised = await Donation.aggregate([{
                        $match: {
                            campaignId: campaign._id
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: '$amount'
                            }
                        }
                    }
                ]);

                return {
                    ...campaign.toObject(),
                    donationCount,
                    totalRaised: totalRaised[0] ? .total || 0
                };
            })
        );

        res.json({
            campaigns: campaignsWithStats
        });
    } catch (error) {
        console.error('Get NGO campaigns error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getNgoCampaigns
};
const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleAuth');

// @route   GET /api/families/profile
// @desc    Get family profile (families only)
// @access  Private (Families only)
router.get('/profile', requireRole(['family']), async (req, res) => {
  try {
    const User = require('../models/User');
    const profile = await User.getProfile(req.user.id);
    
    res.json({
      message: 'Family profile retrieved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Family profile error:', error);
    res.status(500).json({ 
      error: 'Server error getting family profile',
      message: error.message 
    });
  }
});

// @route   GET /api/families/dashboard
// @desc    Get family dashboard data
// @access  Private (Families only)
router.get('/dashboard', requireRole(['family']), async (req, res) => {
  try {
    // This is where you'd add family-specific dashboard logic
    res.json({
      message: 'Family dashboard data',
      data: {
        athlete_profiles: [],
        upcoming_events: [],
        communication_log: {},
        emergency_contacts: []
      }
    });
  } catch (error) {
    console.error('Family dashboard error:', error);
    res.status(500).json({ 
      error: 'Server error getting family dashboard',
      message: error.message 
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleAuth');

// @route   GET /api/coaches/profile
// @desc    Get coach profile (coaches only)
// @access  Private (Coaches only)
router.get('/profile', requireRole(['coach']), async (req, res) => {
  try {
    const User = require('../models/User');
    const profile = await User.getProfile(req.user.id);
    
    res.json({
      message: 'Coach profile retrieved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Coach profile error:', error);
    res.status(500).json({ 
      error: 'Server error getting coach profile',
      message: error.message 
    });
  }
});

// @route   GET /api/coaches/dashboard
// @desc    Get coach dashboard data
// @access  Private (Coaches only)
router.get('/dashboard', requireRole(['coach']), async (req, res) => {
  try {
    // This is where you'd add coach-specific dashboard logic
    res.json({
      message: 'Coach dashboard data',
      data: {
        team_roster: [],
        upcoming_practices: [],
        player_statistics: {},
        team_management: {}
      }
    });
  } catch (error) {
    console.error('Coach dashboard error:', error);
    res.status(500).json({ 
      error: 'Server error getting coach dashboard',
      message: error.message 
    });
  }
});

module.exports = router;

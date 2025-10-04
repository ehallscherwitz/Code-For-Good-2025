const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleAuth');

// @route   GET /api/athletes/profile
// @desc    Get athlete profile (athletes only)
// @access  Private (Athletes only)
router.get('/profile', requireRole(['athlete']), async (req, res) => {
  try {
    const User = require('../models/User');
    const profile = await User.getProfile(req.user.id);
    
    res.json({
      message: 'Athlete profile retrieved successfully',
      profile: profile
    });
  } catch (error) {
    console.error('Athlete profile error:', error);
    res.status(500).json({ 
      error: 'Server error getting athlete profile',
      message: error.message 
    });
  }
});

// @route   GET /api/athletes/dashboard
// @desc    Get athlete dashboard data
// @access  Private (Athletes only)
router.get('/dashboard', requireRole(['athlete']), async (req, res) => {
  try {
    // This is where you'd add athlete-specific dashboard logic
    res.json({
      message: 'Athlete dashboard data',
      data: {
        upcoming_games: [],
        training_schedule: [],
        performance_metrics: {},
        team_announcements: []
      }
    });
  } catch (error) {
    console.error('Athlete dashboard error:', error);
    res.status(500).json({ 
      error: 'Server error getting athlete dashboard',
      message: error.message 
    });
  }
});

module.exports = router;

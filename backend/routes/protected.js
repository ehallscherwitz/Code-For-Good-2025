const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');

// @route   GET /api/protected/profile
// @desc    Get user profile (protected route)
// @access  Private
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // User is available in req.user from the auth middleware
    res.json({
      message: 'Protected route accessed successfully',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.full_name || req.user.user_metadata?.name,
        avatar: req.user.user_metadata?.avatar_url,
        provider: req.user.app_metadata?.provider
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Server error getting profile',
      message: error.message 
    });
  }
});

// @route   GET /api/protected/dashboard
// @desc    Get dashboard data (protected route)
// @access  Private
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    // This route is protected - only authenticated users can access it
    res.json({
      message: 'Dashboard data',
      user: req.user.id,
      data: {
        welcome: `Welcome back, ${req.user.user_metadata?.full_name || req.user.email}!`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      error: 'Server error getting dashboard',
      message: error.message 
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const User = require('../models/User');

// @route   POST /api/auth/google
// @desc    Sign in with Google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { access_token, id_token } = req.body;

    if (!access_token && !id_token) {
      return res.status(400).json({ 
        error: 'Missing Google tokens',
        message: 'access_token or id_token is required' 
      });
    }

    // Sign in with Google using Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token || access_token,
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return res.status(400).json({ 
        error: 'Authentication failed',
        message: error.message 
      });
    }

    res.json({
      message: 'Google authentication successful',
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error('Google OAuth server error:', error);
    res.status(500).json({ 
      error: 'Server error during Google authentication',
      message: error.message 
    });
  }
});

// @route   POST /api/auth/google/url
// @desc    Get Google OAuth URL for frontend
// @access  Public
router.get('/google/url', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (error) {
      console.error('OAuth URL error:', error);
      return res.status(400).json({ 
        error: 'Failed to generate OAuth URL',
        message: error.message 
      });
    }

    res.json({
      url: data.url,
      provider: 'google'
    });

  } catch (error) {
    console.error('OAuth URL server error:', error);
    res.status(500).json({ 
      error: 'Server error generating OAuth URL',
      message: error.message 
    });
  }
});

// @route   POST /api/auth/callback
// @desc    Handle OAuth callback from Google
// @access  Public
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        error: 'Missing authorization code',
        message: 'Authorization code is required' 
      });
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Callback error:', error);
      return res.status(400).json({ 
        error: 'Authentication callback failed',
        message: error.message 
      });
    }

    res.json({
      message: 'Authentication callback successful',
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error('Callback server error:', error);
    res.status(500).json({ 
      error: 'Server error during callback',
      message: error.message 
    });
  }
});

// @route   GET /api/auth/user
// @desc    Get current authenticated user
// @access  Private
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Set the session for this request
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Get user error:', error);
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: error.message 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'No user associated with this token' 
      });
    }

    res.json({
      user: user
    });

  } catch (error) {
    console.error('Get user server error:', error);
    res.status(500).json({ 
      error: 'Server error getting user',
      message: error.message 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7);
    
    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({ 
        error: 'Logout failed',
        message: error.message 
      });
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout server error:', error);
    res.status(500).json({ 
      error: 'Server error during logout',
      message: error.message 
    });
  }
});

// @route   GET /api/auth/profile-status
// @desc    Check if user has completed profile setup
// @access  Private
router.get('/profile-status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: userError?.message || 'User not found' 
      });
    }

    const profileComplete = await User.isProfileComplete(user.id);
    const role = await User.getUserRole(user.id);
    
    res.json({
      profileComplete,
      role: profileComplete ? role : null,
      userId: user.id
    });
  } catch (error) {
    console.error('Profile status error:', error);
    res.status(500).json({ error: 'Failed to check profile status' });
  }
});

// @route   POST /api/auth/complete-profile
// @desc    Complete user profile setup with role selection
// @access  Private
router.post('/complete-profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: userError?.message || 'User not found' 
      });
    }

    const profileData = req.body;
    
    // Validate required fields
    if (!profileData.role || !['athlete', 'coach', 'family'].includes(profileData.role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        message: 'Role must be athlete, coach, or family' 
      });
    }

    // Check if profile already exists
    const existingProfile = await User.isProfileComplete(user.id);
    if (existingProfile) {
      return res.status(400).json({ 
        error: 'Profile already exists',
        message: 'User profile has already been completed' 
      });
    }
    
    const profile = await User.createProfile(user.id, profileData);
    
    res.json({
      message: 'Profile created successfully',
      profile,
      role: profileData.role
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ 
      error: 'Failed to create profile',
      message: error.message 
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get complete user profile with role data
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: userError?.message || 'User not found' 
      });
    }

    const profile = await User.getProfile(user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        error: 'Profile not found',
        message: 'User profile has not been created yet' 
      });
    }
    
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile',
      message: error.message 
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7);
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: userError?.message || 'User not found' 
      });
    }

    const profileData = req.body;
    const updatedProfile = await User.updateProfile(user.id, profileData);
    
    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

module.exports = router;

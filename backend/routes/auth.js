const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

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


module.exports = router;

const supabase = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header',
        message: 'Bearer token is required' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Token verification error:', error);
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

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      error: 'Server error during authentication',
      message: error.message 
    });
  }
};

module.exports = authenticateUser;

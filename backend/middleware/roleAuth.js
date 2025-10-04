const User = require('../models/User');

// Middleware to require specific roles
const requireRole = (roles) => {
  return async (req, res, next) => {
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
      const { data: { user }, error: userError } = require('../config/supabase').auth.getUser(token);
      
      if (userError || !user) {
        return res.status(401).json({ 
          error: 'Invalid or expired token',
          message: userError?.message || 'User not found' 
        });
      }

      const userRole = await User.getUserRole(user.id);
      
      if (!userRole) {
        return res.status(403).json({ 
          error: 'Profile not completed',
          message: 'User profile must be completed before accessing this resource' 
        });
      }

      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `This resource requires one of the following roles: ${roles.join(', ')}`,
          required: roles,
          current: userRole
        });
      }

      // Add user and role to request object
      req.user = user;
      req.userRole = userRole;
      next();

    } catch (error) {
      console.error('Role authentication error:', error);
      res.status(500).json({ 
        error: 'Server error during role authentication',
        message: error.message 
      });
    }
  };
};

// Middleware to check if user has completed profile
const requireProfileComplete = async (req, res, next) => {
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
    const { data: { user }, error: userError } = require('../config/supabase').auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        message: userError?.message || 'User not found' 
      });
    }

    const profileComplete = await User.isProfileComplete(user.id);
    
    if (!profileComplete) {
      return res.status(403).json({ 
        error: 'Profile not completed',
        message: 'User profile must be completed before accessing this resource' 
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Profile completion check error:', error);
    res.status(500).json({ 
      error: 'Server error during profile check',
      message: error.message 
    });
  }
};

module.exports = {
  requireRole,
  requireProfileComplete
};

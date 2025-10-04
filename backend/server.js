const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API Routes - Add your custom routes here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protected'));
app.use('/api/athletes', require('./routes/athletes'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/families', require('./routes/families'));
// app.use('/api/your-route', require('./routes/your-route'));

// Supabase test endpoint
app.get('/api/test-supabase', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    
    // Test the connection by getting the current user (should be null if not authenticated)
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return res.status(500).json({ 
        message: 'Supabase connection error', 
        error: error.message 
      });
    }
    
    res.json({ 
      message: 'Supabase connected successfully!',
      user: data.user,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Supabase test error:', error);
    res.status(500).json({ 
      message: 'Failed to connect to Supabase',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

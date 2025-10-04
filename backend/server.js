const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const schoolsRouter = require('./routes/schools');
const teamsRouter = require('./routes/teams');
const athletesRouter = require('./routes/athletes');
const alumniRouter = require('./routes/alumni');
const familiesRouter = require('./routes/families');
const authRouter = require('./routes/auth');
const surveysRouter = require('./routes/surveys');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase middleware
app.use((req, res, next) => {
  const supabase = require('./config/supabase');
  req.supabase = supabase;
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Code for Good API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      surveys: '/api/surveys',
      schools: '/api/schools',
      teams: '/api/teams',
      athletes: '/api/athletes',
      alumni: '/api/alumni',
      families: '/api/families'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/surveys', surveysRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/athletes', athletesRouter);
app.use('/api/alumni', alumniRouter);
app.use('/api/families', familiesRouter);

// Supabase test endpoint
app.get('/api/test-supabase', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    const { data, error } = await supabase.from('SCHOOL').select('*').limit(1);

    if (error) {
      return res.status(500).json({
        message: 'Supabase connection error',
        error: error.message
      });
    }

    res.json({
      message: 'Supabase connected successfully!',
      sample: data,
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
    available_routes: [
      'GET /',
      'GET /api/health',
      'GET /api/test-supabase',
      'POST /api/auth/google',
      'GET /api/auth/google/url',
      'POST /api/auth/callback',
      'GET /api/auth/user',
      'POST /api/auth/logout',
      'POST /api/surveys/family',
      'POST /api/surveys/athlete',
      'POST /api/surveys/coach',
      'GET /api/surveys/all',
      'GET /api/schools',
      'GET /api/schools/:id',
      'DELETE /api/schools/:id',
      'GET /api/teams',
      'GET /api/teams/:school_id',
      'GET /api/athletes',
      'GET /api/athletes/team/:team_id',
      'GET /api/alumni',
      'GET /api/families'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

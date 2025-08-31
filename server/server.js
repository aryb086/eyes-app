const path = require('path');
const dotenv = require('dotenv');

// Load environment variables (optional, for local development)
// In production (Heroku), environment variables are already set
dotenv.config({ path: path.join(__dirname, '../.env'), silent: true });

// Import config after environment variables are loaded
const config = require('./config/config');

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const multer = require('multer');

// Import utilities
// const logger = require('./utils/logger');
// const { errorResponse } = require('./utils/apiUtils');

// Import security middleware
const { setSecurityHeaders, preventHttpParamPollution, sanitizeData, apiLimiter, authLimiter } = require('./middlewares/security.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const locationRoutes = require('./routes/location.routes');

// Initialize Express app
const app = express();

// Trust proxy for Heroku deployment (fixes rate limiting issues)
app.set('trust proxy', true);

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB (non-blocking)
const connectDB = require('./config/db');
console.log('About to call connectDB()...');
connectDB().catch(err => {
  console.log('Database connection failed, but server will continue:', err.message);
});
console.log('connectDB() called, continuing with server startup...');

// Set security HTTP headers
// app.use(setSecurityHeaders);

// Development logging with detailed request info
if (config.env === 'development') {
  // Standard HTTP logging
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Multer middleware for handling multipart/form-data (file uploads)
// Moved to individual route files to avoid conflicts

app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(preventHttpParamPollution);

// Sanitize request data
// app.use(sanitizeData);

// Enable CORS for all origins (temporarily for testing)
console.log('Enabling CORS for all origins');
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting for API routes - temporarily disabled for testing
// if (config.env === 'production') {
//   app.use('/api', apiLimiter);
// }

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/location', locationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Test endpoint that doesn't require database
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Note: Global error handler is defined below; avoid early handlers that mask proper status/messages

// 404 handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Set default values if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  console.log(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  console.log(err.stack);

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production: Don't leak error details
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Something went wrong!'
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || config.port || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server running in ${config.env} mode on ${HOST}:${PORT}`);
  console.log(`MongoDB URI: ${config.mongoose.url}`);
  console.log(`CORS enabled for all origins`);
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});

module.exports = app;

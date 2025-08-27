const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Headers:', req.headers);
  
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header:', token ? 'Present' : 'Missing');
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
    console.log('Token from cookie:', token ? 'Present' : 'Missing');
  } else {
    console.log('No token found in headers or cookies');
  }

  // Make sure token exists
  if (!token) {
    console.log('No token provided');
    return next(new ErrorResponse('Not authorized to access this route. No token provided.', 401));
  }

  try {
    console.log('Verifying token...');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Get user from the token
    console.log('Finding user with ID:', decoded.id);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('User not found with ID:', decoded.id);
      return next(new ErrorResponse('User no longer exists', 401));
    }
    
    console.log('User authenticated successfully:', { id: req.user._id, email: req.user.email });
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return next(new ErrorResponse(`Not authorized to access this route. ${err.message}`, 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is the owner of the resource
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
    
    // Make sure user is resource owner or admin
    if (resource.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this resource`,
          401
        )
      );
    }
    
    next();
  };
};

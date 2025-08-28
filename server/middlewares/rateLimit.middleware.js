const rateLimit = require('express-rate-limit');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Rate limiting middleware
 * Limits the number of requests from a single IP address
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Login rate limiting middleware
 * Stricter rate limiting for login attempts
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts from this IP, please try again after an hour',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  },
  skipSuccessfulRequests: true, // Only count failed login attempts
});

/**
 * Password reset rate limiting middleware
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset attempts per hour
  message: 'Too many password reset attempts, please try again later',
  handler: (req, res, next, options) => {
    throw new ErrorResponse(options.message, 429);
  },
});

/**
 * Custom rate limiter for specific routes
 * @param {Object} options - Rate limiting options
 * @returns {Function} - Rate limiting middleware
 */
const customLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    ...options,
  };

  return rateLimit({
    ...defaultOptions,
    handler: (req, res, next, opts) => {
      throw new ErrorResponse(opts.message, 429);
    },
  });
};

module.exports = {
  apiLimiter,
  loginLimiter,
  passwordResetLimiter,
  customLimiter,
};

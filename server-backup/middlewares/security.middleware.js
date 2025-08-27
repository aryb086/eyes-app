const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('./rateLimit.middleware');
const config = require('../config/config');

/**
 * Set security HTTP headers
 */
const setSecurityHeaders = (req, res, next) => {
  // Use Helmet to set various HTTP headers for security
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.google.com',
          'https://www.gstatic.com',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.google-analytics.com',
          'https://*.g.doubleclick.net',
          'https://*.google.com',
          'https://*.googleapis.com',
          'https://*.gstatic.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'data:',
        ],
        connectSrc: [
          "'self'",
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.g.doubleclick.net',
        ],
        frameSrc: [
          "'self'",
          'https://www.google.com',
          'https://www.youtube.com',
        ],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for some external resources
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: true },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 15552000, // 180 days in seconds
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true,
  })(req, res, next);
};

/**
 * Prevent HTTP Parameter Pollution
 */
const preventHttpParamPollution = hpp({
  whitelist: [
    'filter',
    'sort',
    'limit',
    'page',
    'select',
    'populate',
  ],
});

/**
 * Sanitize request data
 */
const sanitizeData = [
  // Sanitize request data
  xss(), // Prevent XSS attacks
  
  // Sanitize mongoDB operator injection
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] was sanitized`, req[key]);
    },
  }),
  
  // Sanitize request body
  (req, res, next) => {
    // Sanitize request body
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
        }
      });
    }
    
    // Sanitize request query
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = req.query[key].trim();
        }
      });
    }
    
    // Sanitize request params
    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = req.params[key].trim();
        }
      });
    }
    
    next();
  },
];

/**
 * Rate limiting for API routes
 */
const apiLimiter = rateLimit.apiLimiter;

/**
 * Rate limiting for auth routes
 */
const authLimiter = rateLimit.loginLimiter;

module.exports = {
  setSecurityHeaders,
  preventHttpParamPollution,
  sanitizeData,
  apiLimiter,
  authLimiter,
};

const ErrorResponse = require('./errorResponse');
const logger = require('./logger');

/**
 * Async handler to wrap route handlers and catch errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Wrapped route handler with error handling
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error(`Async Handler Error: ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      stack: error.stack,
    });
    next(error);
  });
};

/**
 * Format success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} - Formatted JSON response
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Array} errors - Additional error details
 * @returns {Object} - Formatted JSON error response
 */
const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = []) => {
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error: ${message}`, { statusCode, errors });
  }

  return res.status(statusCode).json(response);
};

/**
 * Handle validation errors
 * @param {Object} error - Validation error object
 * @param {Object} res - Express response object
 * @param {string} message - Custom error message
 * @returns {Object} - Formatted validation error response
 */
const handleValidationError = (error, res, message = 'Validation Error') => {
  const errors = [];
  
  if (error.name === 'ValidationError') {
    // Mongoose validation error
    Object.keys(error.errors).forEach((key) => {
      errors.push({
        field: key,
        message: error.errors[key].message,
      });
    });
  } else if (error.name === 'MongoError' && error.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(error.keyValue)[0];
    errors.push({
      field,
      message: `${field} already exists`,
    });
  } else if (Array.isArray(error)) {
    // Joi validation error
    error.forEach((err) => {
      errors.push({
        field: err.context.key,
        message: err.message,
      });
    });
  } else if (error.errors) {
    // Custom validation error
    errors.push(...error.errors);
  } else {
    // Generic error
    errors.push({
      message: error.message || 'An unknown error occurred',
    });
  }

  return errorResponse(
    res,
    message,
    error.statusCode || 400,
    errors
  );
};

/**
 * Handle not found errors
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource not found
 * @returns {Object} - Formatted not found response
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(
    res,
    `${resource} not found`,
    404
  );
};

/**
 * Handle unauthorized errors
 * @param {Object} res - Express response object
 * @param {string} message - Custom error message
 * @returns {Object} - Formatted unauthorized response
 */
const unauthorizedResponse = (res, message = 'Not authorized to access this route') => {
  return errorResponse(
    res,
    message,
    401
  );
};

/**
 * Handle forbidden errors
 * @param {Object} res - Express response object
 * @param {string} message - Custom error message
 * @returns {Object} - Formatted forbidden response
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(
    res,
    message,
    403
  );
};

/**
 * Handle rate limit errors
 * @param {Object} res - Express response object
 * @param {string} message - Custom error message
 * @returns {Object} - Formatted rate limit response
 */
const rateLimitResponse = (res, message = 'Too many requests, please try again later') => {
  return errorResponse(
    res,
    message,
    429
  );
};

module.exports = {
  asyncHandler,
  successResponse,
  errorResponse,
  handleValidationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitResponse,
};

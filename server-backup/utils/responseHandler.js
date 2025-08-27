class ResponseHandler {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {Object} pagination - Pagination information
   * @returns {Object} - JSON response
   */
  static success(res, statusCode = 200, message = 'Success', data = null, pagination = null) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    if (pagination !== null) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} errors - Additional error details
   * @returns {Object} - JSON response
   */
  static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors !== null) {
      response.errors = errors;
    }

    // If in development, include stack trace
    if (process.env.NODE_ENV === 'development' && statusCode === 500) {
      response.stack = new Error().stack;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation errors
   * @returns {Object} - JSON response
   */
  static validationError(res, errors) {
    return this.error(
      res,
      400,
      'Validation Error',
      Array.isArray(errors) ? errors : [errors]
    );
  }

  /**
   * Send not found response
   * @param {Object} res - Express response object
   * @param {string} resource - Name of the resource not found
   * @returns {Object} - JSON response
   */
  static notFound(res, resource = 'Resource') {
    return this.error(res, 404, `${resource} not found`);
  }

  /**
   * Send unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   * @returns {Object} - JSON response
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, 401, message);
  }

  /**
   * Send forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   * @returns {Object} - JSON response
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, 403, message);
  }

  /**
   * Send conflict response
   * @param {Object} res - Express response object
   * @param {string} message - Conflict message
   * @returns {Object} - JSON response
   */
  static conflict(res, message = 'Conflict') {
    return this.error(res, 409, message);
  }
}

module.exports = ResponseHandler;

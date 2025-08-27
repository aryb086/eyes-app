class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = this.constructor.name;
  }

  // Static method to create a new ErrorResponse
  static create(message, statusCode) {
    return new ErrorResponse(message, statusCode);
  }

  // Format the error for the response
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      stack: process.env.NODE_ENV === 'development' ? this.stack : {}
    };
  }
}

module.exports = ErrorResponse;

const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Validate request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  // Define the validation options
  const options = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Allow unknown keys that will be ignored
    stripUnknown: true, // Remove unknown keys from the validated data
  };

  // Define the request data to validate
  const dataToValidate = {
    body: req.body,
    query: req.query,
    params: req.params,
  };

  // Validate the request data against the schema
  const { error, value } = schema.validate(dataToValidate, options);

  // If validation fails, return an error
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
      type: detail.type,
    }));

    return next(new ErrorResponse('Validation Error', 400, errorDetails));
  }

  // Replace the request data with the validated data
  req.validatedData = value;
  next();
};

/**
 * Create a validation middleware with a custom schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
const createValidator = (schema) => validate(schema);

// Common validation schemas
const schemas = {
  // User registration schema
  register: Joi.object({
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      fullName: Joi.string().max(100),
    }),
  }),

  // User login schema
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),

  // Create post schema
  createPost: Joi.object({
    body: Joi.object({
      content: Joi.string().max(1000).required(),
      images: Joi.array().items(Joi.string().uri()).max(4),
      tags: Joi.array().items(Joi.string().max(50)),
      location: Joi.string().max(100),
    }),
  }),

  // Update post schema
  updatePost: Joi.object({
    body: Joi.object({
      content: Joi.string().max(1000),
      images: Joi.array().items(Joi.string().uri()).max(4),
      tags: Joi.array().items(Joi.string().max(50)),
      location: Joi.string().max(100),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().required(),
    }),
  }),

  // Create comment schema
  createComment: Joi.object({
    body: Joi.object({
      content: Joi.string().max(500).required(),
      parentComment: Joi.string().alphanum(),
    }),
    params: Joi.object({
      postId: Joi.string().alphanum().required(),
    }),
  }),

  // Update profile schema
  updateProfile: Joi.object({
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email(),
      fullName: Joi.string().max(100),
      bio: Joi.string().max(500),
      profilePicture: Joi.string().uri(),
    }),
  }),

  // Change password schema
  changePassword: Joi.object({
    body: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    }),
  }),
};

// Create pre-configured validation middlewares
const validators = {
  validateRegister: createValidator(schemas.register),
  validateLogin: createValidator(schemas.login),
  validateCreatePost: createValidator(schemas.createPost),
  validateUpdatePost: createValidator(schemas.updatePost),
  validateCreateComment: createValidator(schemas.createComment),
  validateUpdateProfile: createValidator(schemas.updateProfile),
  validateChangePassword: createValidator(schemas.changePassword),
};

module.exports = {
  validate,
  createValidator,
  schemas,
  ...validators,
};

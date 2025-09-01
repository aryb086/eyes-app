const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const ErrorResponse = require('../utils/errorResponse');

// Validation result handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation failed', 400, errors.array()));
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    handleValidationErrors
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    handleValidationErrors
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth.protect, authController.getMe);

// @route   POST /api/auth/logout
// @desc    Log user out / clear cookie
// @access  Private
router.post('/logout', auth.protect, authController.logout);

// @route   PUT /api/auth/updatedetails
// @desc    Update user details
// @access  Private
router.put('/updatedetails', auth.protect, authController.updateDetails);

// @route   PUT /api/auth/updatepassword
// @desc    Update password
// @access  Private
router.put(
  '/updatepassword',
  [
    auth.protect,
    [
      check('currentPassword', 'Please enter your current password').exists(),
      check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ]
  ],
  authController.updatePassword
);

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password - Generate and send reset token
// @access  Public
router.post(
  '/forgotpassword',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  authController.forgotPassword
);

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password with token
// @access  Public
router.put(
  '/resetpassword/:resettoken',
  [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.resetPassword
);

// @route   POST /api/auth/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/google', authController.googleAuth);

// @route   POST /api/auth/github
// @desc    GitHub OAuth authentication
// @access  Public
router.post('/github', authController.githubAuth);

module.exports = router;

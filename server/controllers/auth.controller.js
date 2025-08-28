const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const axios = require('axios');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { username, email, password, fullName } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    
    if (user) {
      return next(
        new ErrorResponse(
          user.email === email 
            ? 'Email is already registered' 
            : 'Username is already taken',
          400
        )
      );
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
      fullName: fullName || username
    });

    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check that user exists by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    // Send simple response for testing
    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    fullName: req.body.fullName,
    email: req.body.email,
    bio: req.body.bio
  };

  try {
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // For security, don't reveal if the email exists or not
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Email message
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });

      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    } catch (err) {
      console.error('Error sending email:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token response to log the user in
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
};

// getSignedJwtToken method is now defined in the User model

// @desc    Google OAuth authentication
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new ErrorResponse('Authorization code is required', 400));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: '899675673892-hq5n5981vs1b14i82krmoe42j619jq17.apps.googleusercontent.com',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${req.protocol}://${req.get('host')}/auth/callback`
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return next(new ErrorResponse('Failed to get access token from Google', 400));
    }

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { email, name, picture, sub: googleId } = userResponse.data;

    if (!email) {
      return next(new ErrorResponse('Email is required from Google', 400));
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token
      const token = user.getSignedJwtToken();
      user.password = undefined;
      
      return res.status(200).json({
        success: true,
        token,
        user
      });
    }

    // Create new user
    const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
    
    user = await User.create({
      email,
      username,
      fullName: name || username,
      password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
      googleId,
      avatar: picture
    });

    // Generate token
    const token = user.getSignedJwtToken();
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    return next(new ErrorResponse('Google authentication failed', 500));
  }
};

// @desc    GitHub OAuth authentication
// @route   POST /api/auth/github
// @access  Public
exports.githubAuth = async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new ErrorResponse('Authorization code is required', 400));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: 'Ov23liXo617YNO4flFpn', // Your GitHub client ID
      client_secret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
      code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return next(new ErrorResponse('Failed to get access token from GitHub', 400));
    }

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`
      }
    });

    const { email, name, avatar_url, id: githubId } = userResponse.data;

    // Get user email if not provided in user response
    let userEmail = email;
    if (!userEmail) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${access_token}`
        }
      });
      const primaryEmail = emailsResponse.data.find(email => email.primary);
      userEmail = primaryEmail ? primaryEmail.email : null;
    }

    if (!userEmail) {
      return next(new ErrorResponse('Email is required from GitHub', 400));
    }

    // Check if user already exists
    let user = await User.findOne({ email: userEmail });

    if (user) {
      // User exists, generate token
      const token = user.getSignedJwtToken();
      user.password = undefined;
      
      return res.status(200).json({
        success: true,
        token,
        user
      });
    }

    // Create new user
    const username = name ? name.replace(/\s+/g, '_').toLowerCase() : 
                    userEmail.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
    
    user = await User.create({
      email: userEmail,
      username,
      fullName: name || username,
      password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
      githubId,
      avatar: avatar_url
    });

    // Generate token
    const token = user.getSignedJwtToken();
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error('GitHub OAuth error:', err);
    return next(new ErrorResponse('GitHub authentication failed', 500));
  }
};

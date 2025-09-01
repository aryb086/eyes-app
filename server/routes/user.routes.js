const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all routes
router.use(auth.protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth.authorize('admin'), userController.getUsers);

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', userController.searchUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put(
  '/:id',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', userController.deleteUser);

// @route   PUT /api/users/follow/:id
// @desc    Follow a user
// @access  Private
router.put('/follow/:id', userController.followUser);

// @route   PUT /api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.put('/unfollow/:id', userController.unfollowUser);

// @route   GET /api/users/followers/:id
// @desc    Get user's followers
// @access  Public
router.get('/followers/:id', userController.getUserFollowers);

// @route   GET /api/users/following/:id
// @desc    Get users that a user is following
// @access  Public
router.get('/following/:id', userController.getUserFollowing);

// @route   PUT /api/users/update-location
// @desc    Update user location
// @access  Private
router.put('/update-location', userController.updateUserLocation);

module.exports = router;

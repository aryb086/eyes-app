const User = require('../models/User');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = User.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const users = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'posts',
      select: 'content images likes comments createdAt',
      options: { sort: { createdAt: -1 } }
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is user owner or admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this user`,
          401
        )
      );
    }

    // Check if username is being updated and if it's already taken
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return next(new ErrorResponse('Username is already taken', 400));
      }
    }

    // Check if email is being updated and if it's already in use
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return next(new ErrorResponse('Email is already in use', 400));
      }
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is user owner or admin
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this user`,
          401
        )
      );
    }

    // Delete user's posts
    await Post.deleteMany({ author: user._id });
    
    // Remove user from followers and following arrays of other users
    await User.updateMany(
      { $or: [{ followers: user._id }, { following: user._id }] },
      { 
        $pull: { 
          followers: user._id,
          following: user._id 
        } 
      }
    );

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('You cannot follow yourself', 400));
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return next(new ErrorResponse('Already following this user', 400));
    }

    // Add to following list
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { following: userToFollow._id } },
      { new: true, runValidators: true }
    );

    // Add to followers list of the user being followed
    await User.findByIdAndUpdate(
      userToFollow._id,
      { $addToSet: { followers: req.user.id } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `You are now following ${userToFollow.username}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('You cannot unfollow yourself', 400));
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already not following
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return next(new ErrorResponse('You are not following this user', 400));
    }

    // Remove from following list
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { following: userToUnfollow._id } },
      { new: true, runValidators: true }
    );

    // Remove from followers list of the user being unfollowed
    await User.findByIdAndUpdate(
      userToUnfollow._id,
      { $pull: { followers: req.user.id } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.username}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's followers
// @route   GET /api/users/followers/:id
// @access  Public
exports.getUserFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'followers',
      select: 'username fullName profilePicture'
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      data: user.followers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users that a user is following
// @route   GET /api/users/following/:id
// @access  Public
exports.getUserFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'following',
      select: 'username fullName profilePicture'
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      data: user.following
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return next(new ErrorResponse('Please provide a search query', 400));
    }

    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select('username fullName profilePicture');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

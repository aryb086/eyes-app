const Post = require('../models/Post');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again later.',
        error: 'Database connection unavailable'
      });
    }

    const { city, neighborhood, category, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query filters
    const filters = {};
    if (city) filters.city = city;
    if (neighborhood) filters.neighborhood = neighborhood;
    if (category && category !== 'undefined') filters.category = category;
    
    console.log('Query filters:', filters);
    
    const posts = await Post.find(filters)
      .populate({
        path: 'author',
        select: 'username fullName profilePicture avatar'
      })
      .populate({
        path: 'comments',
        select: 'content author likes createdAt',
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: 'author',
            select: 'username fullName profilePicture avatar'
          },
          {
            path: 'likes',
            select: 'username fullName profilePicture avatar'
          }
        ]
      })
      .populate({
        path: 'likes',
        select: 'username fullName profilePicture avatar'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments(filters);
    
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      posts: posts
    });

  } catch (err) {
    console.error('Error in getPosts:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: err.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'username fullName profilePicture avatar'
      })
      .populate({
        path: 'comments',
        select: 'content author likes createdAt',
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: 'author',
            select: 'username fullName profilePicture avatar'
          },
          {
            path: 'likes',
            select: 'username fullName profilePicture avatar'
          }
        ]
      })
      .populate({
        path: 'likes',
        select: 'username fullName profilePicture avatar'
      });

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    console.log('=== CREATE POST REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);
    console.log('Headers:', req.headers);
    console.log('File:', req.file);
    
    // Add user and location data to req.body
    const user = await User.findById(req.user.id).select('location cityId stateCode neighborhood');
    
    const postData = {
      ...req.body,
      author: req.user.id,
      city: req.body.city || user.city,
      cityId: req.body.cityId || user.cityId,
      stateCode: req.body.stateCode || user.stateCode,
      neighborhood: req.body.neighborhood || user.neighborhood
    };

    // Handle image upload if present
    if (req.file) {
      // For now, store the file info (in production, you'd upload to cloud storage)
      postData.images = [{
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        // In production, you'd store the cloud storage URL here
        url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      }];
    }
    
    console.log('Post data with location and image:', postData);

    const post = await Post.create(postData);
    console.log('Post created successfully:', post);

    // Add post to user's posts array
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      {
        $push: { posts: post._id },
        $inc: { postCount: 1 }
      },
      { new: true }
    );
    
    console.log('User updated with new post:', updatedUser);

    // Populate the author field for the response
    const populatedPost = await Post.findById(post._id).populate({
      path: 'author',
      select: 'username fullName profilePicture avatar'
    });

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (err) {
    console.error('Error creating post:', err);
    next(err);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this post`,
          401
        )
      );
    }

    // Set isEdited to true if content is being updated
    if (req.body.content) {
      req.body.isEdited = true;
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'author',
      select: 'username fullName profilePicture avatar'
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this post`,
          401
        )
      );
    }

    // TODO: Delete associated images from storage if needed

    await post.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if the post has already been liked
    if (post.likes.includes(req.user.id)) {
      return next(new ErrorResponse('Post already liked', 400));
    }

    post.likes.unshift(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a post
// @route   PUT /api/posts/unlike/:id
// @access  Private
exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if the post has not yet been liked
    if (!post.likes.includes(req.user.id)) {
      return next(new ErrorResponse('Post has not yet been liked', 400));
    }

    // Get remove index
    const removeIndex = post.likes.indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .sort('-createdAt')
      .populate({
        path: 'author',
        select: 'username fullName profilePicture'
      })
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        options: { sort: { createdAt: -1 }, limit: 2 },
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      })
      .populate({
        path: 'likes',
        select: 'username fullName profilePicture',
        options: { limit: 5 }
      });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get feed posts (posts from users the current user follows)
// @route   GET /api/posts/feed/me
// @access  Private
exports.getFeedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const posts = await Post.find({
      $or: [
        { author: { $in: user.following } },
        { author: req.user.id } // Include user's own posts
      ]
    })
      .sort('-createdAt')
      .populate({
        path: 'author',
        select: 'username fullName profilePicture'
      })
      .populate({
        path: 'comments',
        select: 'content author createdAt',
        options: { sort: { createdAt: -1 }, limit: 2 },
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      })
      .populate({
        path: 'likes',
        select: 'username fullName profilePicture',
        options: { limit: 5 }
      });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts by location (city and/or neighborhood)
// @route   GET /api/posts/location
// @access  Public
exports.getPostsByLocation = async (req, res, next) => {
  try {
    const { city, neighborhood, limit = 20, page = 1 } = req.query;
    
    // Build query based on location parameters
    const query = {};
    if (city) query.city = city;
    if (neighborhood) query.neighborhood = neighborhood;
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const posts = await Post.find(query)
      .populate({
        path: 'author',
        select: 'username fullName profilePicture'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      posts: posts
    });
  } catch (err) {
    console.error('Error in getPostsByLocation:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts by location',
      error: err.message
    });
  }
};

// @desc    Get posts by city
// @route   GET /api/posts/city/:city
// @access  Public
exports.getPostsByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ city })
      .populate({
        path: 'author',
        select: 'username fullName profilePicture avatar'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments({ city });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      posts: posts
    });
  } catch (err) {
    console.error('Error in getPostsByCity:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts by city',
      error: err.message
    });
  }
};

// @desc    Get posts by neighborhood
// @route   GET /api/posts/neighborhood/:neighborhood
// @access  Public
exports.getPostsByNeighborhood = async (req, res, next) => {
  try {
    const { neighborhood } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ neighborhood })
      .populate({
        path: 'author',
        select: 'username fullName profilePicture avatar'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments({ neighborhood });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      posts: posts
    });
  } catch (err) {
    console.error('Error in getPostsByNeighborhood:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts by neighborhood',
      error: err.message
    });
  }
};

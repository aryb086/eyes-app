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
    console.log('=== 🚀 CREATE POST REQUEST START ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🔐 User ID:', req.user.id);
    console.log('🔐 User object:', req.user);
    console.log('📋 Request method:', req.method);
    console.log('🌐 Request URL:', req.originalUrl);
    console.log('📤 Request IP:', req.ip);
    
    // === HEADERS ANALYSIS ===
    console.log('=== 📋 HEADERS ANALYSIS ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('All headers:', JSON.stringify(req.headers, null, 2));
    
    // === BODY ANALYSIS ===
    console.log('=== 📦 BODY ANALYSIS ===');
    console.log('Body type:', typeof req.body);
    console.log('Body is array:', Array.isArray(req.body));
    console.log('Body is null:', req.body === null);
    console.log('Body is undefined:', req.body === undefined);
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('Body values:', JSON.stringify(req.body, null, 2));
    console.log('Body stringified length:', JSON.stringify(req.body).length);
    
    // === MULTER ANALYSIS ===
    console.log('=== 🖼️ MULTER ANALYSIS ===');
    console.log('Multer file present:', !!req.file);
    if (req.file) {
      console.log('File fieldname:', req.file.fieldname);
      console.log('File originalname:', req.file.originalname);
      console.log('File mimetype:', req.file.mimetype);
      console.log('File size:', req.file.size);
      console.log('File buffer length:', req.file.buffer ? req.file.buffer.length : 'No buffer');
      console.log('File encoding:', req.file.encoding);
    }
    
    // === MULTIPART ANALYSIS ===
    console.log('=== 🔗 MULTIPART ANALYSIS ===');
    const isMultipart = req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data');
    console.log('Is multipart request:', isMultipart);
    if (isMultipart) {
      console.log('Content-Type includes boundary:', req.headers['content-type'].includes('boundary'));
      console.log('Full Content-Type:', req.headers['content-type']);
    }
    
    // === MULTER DATA ANALYSIS ===
    console.log('=== 🔧 MULTER DATA ANALYSIS ===');
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('File present:', !!req.file);
    if (req.file) {
      console.log('File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }
    
    // === USER LOOKUP ANALYSIS ===
    console.log('=== 👤 USER LOOKUP ANALYSIS ===');
    console.log('Looking up user with ID:', req.user.id);
    
    const user = await User.findById(req.user.id).select('location cityId stateCode neighborhood');
    console.log('User lookup result:', user ? 'Success' : 'Failed');
    if (user) {
      console.log('User city:', user.city);
      console.log('User cityId:', user.cityId);
      console.log('User stateCode:', user.stateCode);
      console.log('User neighborhood:', user.neighborhood);
      console.log('User location:', user.location);
    } else {
      console.log('❌ USER NOT FOUND - This will cause validation errors!');
    }
    
    // === FIELD VALIDATION ANALYSIS ===
    console.log('=== ✅ FIELD VALIDATION ANALYSIS ===');
    console.log('Content field present:', !!req.body.content);
    console.log('Content field value:', req.body.content);
    console.log('Content field type:', typeof req.body.content);
    console.log('Content field length:', req.body.content ? req.body.content.length : 'N/A');
    
    console.log('City field present:', !!req.body.city);
    console.log('City field value:', req.body.city);
    console.log('CityId field present:', !!req.body.cityId);
    console.log('CityId field value:', req.body.cityId);
    console.log('StateCode field present:', !!req.body.stateCode);
    console.log('StateCode field value:', req.body.stateCode);
    console.log('Neighborhood field present:', !!req.body.neighborhood);
    console.log('Neighborhood field value:', req.body.neighborhood);
    
    // Validate required fields
    if (!req.body.content) {
      console.error('❌ VALIDATION FAILED: Missing required field: content');
      console.error('Available fields:', Object.keys(req.body));
      return res.status(400).json({
        success: false,
        message: 'Post content is required',
        debug: {
          availableFields: Object.keys(req.body),
          bodyType: typeof req.body,
          bodyLength: req.body ? Object.keys(req.body).length : 0
        }
      });
    }
    
    // === POST DATA CONSTRUCTION ANALYSIS ===
    console.log('=== 🏗️ POST DATA CONSTRUCTION ANALYSIS ===');
    const postData = {
      ...req.body,
      author: req.user.id,
      city: req.body.city || user?.city || 'FALLBACK_CITY',
      cityId: req.body.cityId || user?.cityId || 'FALLBACK_CITY_ID',
      stateCode: req.body.stateCode || user?.stateCode || 'FALLBACK_STATE',
      neighborhood: req.body.neighborhood || user?.neighborhood || 'FALLBACK_NEIGHBORHOOD'
    };
    
    console.log('Post data construction result:');
    console.log('- Original body fields:', Object.keys(req.body));
    console.log('- Final post data fields:', Object.keys(postData));
    console.log('- Content:', postData.content);
    console.log('- City:', postData.city);
    console.log('- CityId:', postData.cityId);
    console.log('- StateCode:', postData.stateCode);
    console.log('- Neighborhood:', postData.neighborhood);
    console.log('- Author:', postData.author);
    
    // Log the final post data for debugging
    console.log('Final post data object:', JSON.stringify(postData, null, 2));
    
    // === IMAGE PROCESSING ANALYSIS ===
    console.log('=== 🖼️ IMAGE PROCESSING ANALYSIS ===');
    if (req.file) {
      console.log('✅ Image file received:', req.file.originalname);
      console.log('Image file details:');
      console.log('- Field name:', req.file.fieldname);
      console.log('- Original name:', req.file.originalname);
      console.log('- MIME type:', req.file.mimetype);
      console.log('- File size:', req.file.size, 'bytes');
      console.log('- Buffer present:', !!req.file.buffer);
      console.log('- Buffer length:', req.file.buffer ? req.file.buffer.length : 'N/A');
      
      // Convert file buffer to base64 for storage
      try {
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Image}`;
        
        postData.images = [dataUrl];
        console.log('✅ Image converted to base64 successfully');
        console.log('Base64 length:', base64Image.length);
        console.log('Data URL length:', dataUrl.length);
        console.log('MIME type used:', mimeType);
      } catch (imageError) {
        console.error('❌ Error processing image:', imageError);
        console.error('Image error stack:', imageError.stack);
        // Continue without image if processing fails
        postData.images = [];
      }
    } else {
      console.log('ℹ️ No image file received');
    }
    
    // === FINAL POST DATA ANALYSIS ===
    console.log('=== 🎯 FINAL POST DATA ANALYSIS ===');
    console.log('Post data before creation:');
    console.log('- Content length:', postData.content ? postData.content.length : 'N/A');
    console.log('- Category:', postData.category);
    console.log('- City:', postData.city);
    console.log('- CityId:', postData.cityId);
    console.log('- StateCode:', postData.stateCode);
    console.log('- Neighborhood:', postData.neighborhood);
    console.log('- Author:', postData.author);
    console.log('- Images count:', postData.images ? postData.images.length : 0);
    console.log('- Scope:', postData.scope);
    
    // === POST CREATION ANALYSIS ===
    console.log('=== 🚀 POST CREATION ANALYSIS ===');
    console.log('Attempting to create post with data:', JSON.stringify(postData, null, 2));
    
    try {
      const post = await Post.create(postData);
      console.log('✅ Post created successfully!');
      console.log('Post ID:', post._id);
      console.log('Post created at:', post.createdAt);
      console.log('Post content preview:', post.content ? post.content.substring(0, 100) + '...' : 'No content');
    } catch (createError) {
      console.error('❌ POST CREATION FAILED!');
      console.error('Error type:', createError.constructor.name);
      console.error('Error message:', createError.message);
      console.error('Error stack:', createError.stack);
      
      if (createError.name === 'ValidationError') {
        console.error('Validation errors:');
        Object.keys(createError.errors).forEach(key => {
          console.error(`- ${key}:`, createError.errors[key].message);
        });
      }
      
      throw createError; // Re-throw to be caught by outer try-catch
    }
    
    // === USER UPDATE ANALYSIS ===
    console.log('=== 👤 USER UPDATE ANALYSIS ===');
    console.log('Updating user with new post ID:', post._id);
    
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        {
          $push: { posts: post._id },
          $inc: { postCount: 1 }
        },
        { new: true }
      );
      
      console.log('✅ User updated successfully');
      console.log('User post count:', updatedUser.postCount);
      console.log('User posts array length:', updatedUser.posts.length);
    } catch (updateError) {
      console.error('❌ User update failed:', updateError.message);
      // Continue anyway - post was created successfully
    }
    
    // === RESPONSE POPULATION ANALYSIS ===
    console.log('=== 📊 RESPONSE POPULATION ANALYSIS ===');
    console.log('Populating post with author details');
    
    try {
      const populatedPost = await Post.findById(post._id).populate({
        path: 'author',
        select: 'username fullName profilePicture avatar'
      });
      
      console.log('✅ Post populated successfully');
      console.log('Author username:', populatedPost.author?.username);
      console.log('Author full name:', populatedPost.author?.fullName);
    } catch (populateError) {
      console.error('❌ Post population failed:', populateError.message);
      // Use unpopulated post if population fails
      const populatedPost = post;
    }
    
    // === SUCCESS RESPONSE ===
    console.log('=== 🎉 SUCCESS RESPONSE ===');
    console.log('Sending 201 response with populated post');
    
    res.status(201).json({
      success: true,
      data: populatedPost
    });
    
    console.log('=== ✅ CREATE POST REQUEST COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('=== ❌ CREATE POST REQUEST FAILED ===');
    console.error('Error timestamp:', new Date().toISOString());
    console.error('Error type:', err.constructor.name);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    // Additional error analysis
    if (err.name === 'ValidationError') {
      console.error('=== 🔍 VALIDATION ERROR DETAILS ===');
      console.error('Validation error fields:', Object.keys(err.errors));
      Object.keys(err.errors).forEach(key => {
        const fieldError = err.errors[key];
        console.error(`Field: ${key}`);
        console.error(`  - Value:`, fieldError.value);
        console.error(`  - Message:`, fieldError.message);
        console.error(`  - Path:`, fieldError.path);
        console.error(`  - Kind:`, fieldError.kind);
      });
    }
    
    if (err.name === 'CastError') {
      console.error('=== 🔍 CAST ERROR DETAILS ===');
      console.error('Cast error field:', err.path);
      console.error('Cast error value:', err.value);
      console.error('Cast error kind:', err.kind);
    }
    
    if (err.code === 11000) {
      console.error('=== 🔍 DUPLICATE KEY ERROR DETAILS ===');
      console.error('Duplicate key error:', err.keyValue);
    }
    
    console.error('=== 🔍 REQUEST CONTEXT AT ERROR ===');
    console.error('User ID:', req.user?.id);
    console.error('Request body keys:', Object.keys(req.body || {}));
    console.error('Request file present:', !!req.file);
    console.error('Content-Type header:', req.headers['content-type']);
    
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

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth.middleware');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  // Remove fileFilter temporarily to debug boundary issues
  // fileFilter: (req, file, cb) => {
  //   // Accept images only
  //   if (file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only image files are allowed!'), false);
  //   }
  // }
});

// Public routes
router.get('/', postController.getPosts);

// Location-based post routes (must come before /:id route)
router.get('/location', postController.getPostsByLocation);
router.get('/city/:city', postController.getPostsByCity);
router.get('/neighborhood/:neighborhood', postController.getPostsByNeighborhood);

// Parameterized routes (must come after specific routes)
router.get('/:id', postController.getPost);
router.get('/user/:userId', postController.getPostsByUser);

// Protected routes
router.use(auth.protect);

// @route   POST /api/posts
// @desc    Create a post (with or without image)
// @access  Private
router.post(
  '/',
  // Conditional multer middleware - only for multipart requests
  (req, res, next) => {
    console.log('🔍 DEBUG: Content-Type header:', req.headers['content-type']);
    console.log('🔍 DEBUG: Is multipart:', req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data'));
    console.log('🔍 DEBUG: All headers:', JSON.stringify(req.headers, null, 2));
    
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      console.log('🔍 DEBUG: Applying multer middleware');
      upload.single('image')(req, res, next);
    } else {
      console.log('🔍 DEBUG: Skipping multer middleware');
      next();
    }
  },
  [
    check('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 1000 })
      .withMessage('Post cannot be longer than 1000 characters')
  ],
  postController.createPost
);

// @route   POST /api/posts/test-upload
// @desc    Test endpoint for debugging file uploads
// @access  Private
router.post('/test-upload', auth.protect, upload.single('image'), (req, res) => {
  console.log('=== TEST UPLOAD ENDPOINT ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('Files:', req.files);
  
  res.json({
    success: true,
    message: 'Upload test successful',
    body: req.body,
    file: req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null
  });
});

// @route   POST /api/posts/test-raw
// @desc    Test endpoint for raw multipart requests (no middleware)
// @access  Private
router.post('/test-raw', auth.protect, (req, res) => {
  console.log('=== RAW MULTIPART TEST ENDPOINT ===');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body type:', typeof req.body);
  console.log('Body length:', req.body ? req.body.length : 'N/A');
  console.log('Body preview:', req.body ? req.body.substring(0, 500) + '...' : 'No body');
  
  res.json({
    success: true,
    message: 'Raw multipart test successful',
    contentType: req.headers['content-type'],
    bodyType: typeof req.body,
    bodyLength: req.body ? req.body.length : 0,
    bodyPreview: req.body ? req.body.substring(0, 200) : 'No body'
  });
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  '/:id',
  [
    check('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 1000 })
      .withMessage('Post cannot be longer than 1000 characters')
  ],
  auth.protect,
  postController.updatePost
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth.protect, postController.deletePost);

// @route   PUT /api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth.protect, postController.likePost);

// @route   PUT /api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth.protect, postController.unlikePost);

// @route   GET /api/posts/feed/me
// @desc    Get feed posts (posts from users the current user follows)
// @access  Private
router.get('/feed/me', auth.protect, postController.getFeedPosts);

module.exports = router;

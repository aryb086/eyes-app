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
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
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
  upload.single('image'), // Handle single image upload
  [
    check('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 1000 })
      .withMessage('Post cannot be longer than 1000 characters')
  ],
  postController.createPost
);

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

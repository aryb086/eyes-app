const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth.middleware');

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.get('/user/:userId', postController.getPostsByUser);

// Location-based post routes
router.get('/location', postController.getPostsByLocation);
router.get('/city/:city', postController.getPostsByCity);
router.get('/neighborhood/:neighborhood', postController.getPostsByNeighborhood);

// Protected routes
router.use(auth.protect);

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
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

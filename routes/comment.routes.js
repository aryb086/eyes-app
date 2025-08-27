const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const commentController = require('../controllers/comment.controller');
const auth = require('../middlewares/auth.middleware');

// Protected routes
router.use(auth.protect);

// @route   POST /api/comments/:postId
// @desc    Add comment to post
// @access  Private
router.post(
  '/:postId',
  [
    check('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 500 })
      .withMessage('Comment cannot be longer than 500 characters')
  ],
  commentController.addComment
);

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put(
  '/:id',
  [
    check('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 500 })
      .withMessage('Comment cannot be longer than 500 characters')
  ],
  commentController.updateComment
);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', commentController.deleteComment);

// @route   PUT /api/comments/like/:id
// @desc    Like a comment
// @access  Private
router.put('/like/:id', commentController.likeComment);

// @route   PUT /api/comments/unlike/:id
// @desc    Unlike a comment
// @access  Private
router.put('/unlike/:id', commentController.unlikeComment);

// @route   GET /api/comments/:id/replies
// @desc    Get comment replies
// @access  Public
router.get('/:id/replies', commentController.getCommentReplies);

module.exports = router;

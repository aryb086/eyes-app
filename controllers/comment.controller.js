const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Add comment to post
// @route   POST /api/comments/:postId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404)
      );
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null
    });

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    // If this is a reply to another comment, add it to the parent's replies array
    if (req.body.parentComment) {
      await Comment.findByIdAndUpdate(
        req.body.parentComment,
        { $push: { replies: comment._id } },
        { new: true, runValidators: true }
      );
    }

    // Populate the comment with author details
    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'author',
      select: 'username fullName profilePicture'
    });

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is comment owner or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this comment`,
          401
        )
      );
    }

    // Set isEdited to true
    req.body.isEdited = true;

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'author',
      select: 'username fullName profilePicture'
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is comment owner or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this comment`,
          401
        )
      );
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: comment._id } },
      { new: true, runValidators: true }
    );

    // If this is a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: comment._id } },
        { new: true, runValidators: true }
      );
    }

    // Delete all replies to this comment
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // Delete the comment itself
    await comment.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a comment
// @route   PUT /api/comments/like/:id
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if the comment has already been liked
    if (comment.likes.includes(req.user.id)) {
      return next(new ErrorResponse('Comment already liked', 400));
    }

    comment.likes.unshift(req.user.id);
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a comment
// @route   PUT /api/comments/unlike/:id
// @access  Private
exports.unlikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if the comment has not yet been liked
    if (!comment.likes.includes(req.user.id)) {
      return next(new ErrorResponse('Comment has not yet been liked', 400));
    }

    // Get remove index
    const removeIndex = comment.likes.indexOf(req.user.id);
    comment.likes.splice(removeIndex, 1);

    await comment.save();

    res.status(200).json({
      success: true,
      data: comment.likes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comment replies
// @route   GET /api/comments/:id/replies
// @access  Public
exports.getCommentReplies = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
      );
    }

    const replies = await Comment.find({ parentComment: req.params.id })
      .sort('createdAt')
      .populate({
        path: 'author',
        select: 'username fullName profilePicture'
      })
      .populate({
        path: 'likes',
        select: 'username fullName profilePicture',
        options: { limit: 10 }
      });

    res.status(200).json({
      success: true,
      count: replies.length,
      data: replies
    });
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [1000, 'Post cannot be longer than 1000 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(array) {
        return array.length <= 4;
      },
      message: 'Cannot upload more than 4 images per post'
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  scope: {
    type: String,
    enum: ['neighborhood', 'city', 'state', 'global'],
    default: 'neighborhood',
    required: true
  },
  cityId: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  stateCode: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: function() {
      return this.scope === 'neighborhood';
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

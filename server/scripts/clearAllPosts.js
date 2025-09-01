const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const clearAllPosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Delete all comments first (to avoid foreign key issues)
    const deletedComments = await Comment.deleteMany({});
    console.log(`Deleted ${deletedComments.deletedCount} comments`);

    // Delete all posts
    const deletedPosts = await Post.deleteMany({});
    console.log(`Deleted ${deletedPosts.deletedCount} posts`);

    console.log('✅ All posts and comments cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing posts:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
clearAllPosts();

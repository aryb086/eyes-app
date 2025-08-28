const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import the User model
const User = require('../models/User');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const createTestUser = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Check if test user already exists
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (user) {
      // Reset password to a known value; pre-save hook will hash it
      user.password = 'password123';
      await user.save();
      console.log('Test user already exists. Password reset.');
      console.log(`Email: ${user.email}`);
      console.log(`Password: password123`);
      process.exit(0);
    }

    // Create test user
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      // Set plain password; schema pre-save hook will hash it
      password: 'password123',
      fullName: 'Test User',
      // Model uses `isVerified`; keeping compatibility
      isVerified: true
    });

    await user.save();
    
    console.log('Test user created successfully!');
    console.log('Use these credentials to log in:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
};

// Run the script
createTestUser();

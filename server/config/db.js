const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

// Remove mongoose deprecation warnings
mongoose.set('strictQuery', false);

// MongoDB connection options
const options = {
  ...config.mongoose.options,
  // Additional options can be added here if needed
};

// Create the database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, options);
    logger.info('MongoDB connected successfully');

    // When successfully connected
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose default connection open');
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose default connection error: ${err}`);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.warn('Server will continue without database connection');
    // Don't exit the process, let the server start
    // process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = connectDB;

  mongoose: {
    url: envVars.MONGODB_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // Increase timeouts for Heroku deployment
      serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 5s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 30000, // Give more time to establish connection
      maxPoolSize: 10, // Maximum number of connections in the pool
    },
  }, 
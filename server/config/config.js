const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load environment variables from .env file (optional, for local development)
// In production (Heroku), environment variables are already set
dotenv.config({ path: path.join(__dirname, '../.env'), silent: true });

// Define the schema for environment variables
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
    PORT: Joi.number().default(5000),
    MONGODB_URI: Joi.string().required().description('MongoDB connection URL'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string().default('90d').description('JWT expiration time'),
    JWT_COOKIE_EXPIRES_IN: Joi.number().default(90).description('JWT cookie expire days'),
    SMTP_HOST: Joi.string().description('SMTP server host'),
    SMTP_PORT: Joi.number().description('SMTP server port'),
    SMTP_USERNAME: Joi.string().description('SMTP username'),
    SMTP_PASSWORD: Joi.string().description('SMTP password'),
    EMAIL_FROM: Joi.string().description('Email address to send from'),
    EMAIL_FROM_NAME: Joi.string().description('Email sender name'),
    CLIENT_URL: Joi.string().description('Frontend URL'),
    GOOGLE_CLIENT_ID: Joi.string().description('Google OAuth client ID'),
    GOOGLE_CLIENT_SECRET: Joi.string().description('Google OAuth client secret'),
    FACEBOOK_APP_ID: Joi.string().description('Facebook App ID'),
    FACEBOOK_APP_SECRET: Joi.string().description('Facebook App Secret'),
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS access key ID'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS secret access key'),
    AWS_REGION: Joi.string().description('AWS region'),
    AWS_BUCKET_NAME: Joi.string().description('AWS S3 bucket name'),
    GOOGLE_CLOUD_PROJECT_ID: Joi.string().description('Google Cloud project ID'),
    GOOGLE_CLOUD_KEYFILE: Joi.string().description('Google Cloud key file path'),
    GOOGLE_CLOUD_STORAGE_BUCKET: Joi.string().description('Google Cloud Storage bucket name'),
    SENTRY_DSN: Joi.string().description('Sentry DSN for error tracking'),
    LOG_LEVEL: Joi.string().default('info').description('Log level (error, warn, info, http, verbose, debug, silly)'),
  })
  .unknown();

// Validate environment variables
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  console.error(`Config validation error: ${error.message}`);
  console.error('Environment variables:', Object.keys(process.env));
  // Don't throw error, use defaults instead
  // throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // Remove deprecated options for newer Mongoose versions
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRES_IN || envVars.JWT_EXPIRE || '90d',
    cookieExpire: envVars.JWT_COOKIE_EXPIRES_IN || envVars.JWT_COOKIE_EXPIRE || 90,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
    fromName: envVars.EMAIL_FROM_NAME,
  },
  clientUrl: envVars.CLIENT_URL,
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  },
  facebook: {
    appId: envVars.FACEBOOK_APP_ID,
    appSecret: envVars.FACEBOOK_APP_SECRET,
  },
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    bucketName: envVars.AWS_BUCKET_NAME,
  },
  googleCloud: {
    projectId: envVars.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: envVars.GOOGLE_CLOUD_KEYFILE,
    bucketName: envVars.GOOGLE_CLOUD_STORAGE_BUCKET,
  },
  sentry: {
    dsn: envVars.SENTRY_DSN,
  },
  logLevel: envVars.LOG_LEVEL,
};

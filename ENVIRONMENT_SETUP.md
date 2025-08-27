# Environment Variables Setup Guide

## Overview
This guide will help you set up all the necessary environment variables for your Eyes app. The app requires several environment variables to function properly, including database connections, JWT secrets, email configuration, and more.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your actual values (see sections below)

3. **Never commit `.env` files** - they contain sensitive information

## Required Environment Variables

### 1. MongoDB Configuration
```bash
# For local MongoDB with Docker
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DATABASE=eyes_app
MONGODB_URI=mongodb://root:your_secure_password@mongodb:27017/eyes_app?authSource=admin

# For MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eyes_app?retryWrites=true&w=majority
```

### 2. JWT Configuration
```bash
JWT_SECRET=your_super_secret_jwt_key_here_make_this_very_long_and_random
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

**Important:** Generate a strong JWT secret:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 64

# Option 3: Use Python
python3 -c "import secrets; print(secrets.token_hex(64))"
```

### 3. Port Configuration
```bash
PORT=5000
BACKEND_PORT=5001
FRONTEND_PORT=80
```

### 4. Backend URL
```bash
BACKEND_URL=http://backend:5000
```

## Optional Environment Variables

### 5. Email Configuration (SMTP)
```bash
# Gmail example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password  # Use App Password, not regular password
EMAIL_FROM=your_email@gmail.com
EMAIL_FROM_NAME=Eyes App

# Outlook example
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587

# Custom SMTP server
# SMTP_HOST=your_smtp_server.com
# SMTP_PORT=587
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" in your Google Account settings
3. Use the App Password, not your regular password

### 6. Client URL (Frontend)
```bash
CLIENT_URL=http://localhost:3000
```

### 7. OAuth Configuration
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 8. Cloud Storage (Choose one)

#### AWS S3
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_s3_bucket_name
```

#### Google Cloud Storage
```bash
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_KEYFILE=path/to/your/service-account-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket_name
```

### 9. Error Tracking
```bash
SENTRY_DSN=your_sentry_dsn
```

### 10. Logging
```bash
LOG_LEVEL=info  # Options: error, warn, info, http, verbose, debug, silly
```

## Environment-Specific Files

You can create different environment files for different environments:

- `.env` - Default environment variables
- `.env.local` - Local development overrides
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Testing environment

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT and other sensitive data
3. **Rotate secrets regularly** in production
4. **Use environment-specific files** for different deployments
5. **Limit access** to environment variables to only necessary personnel

## Production Deployment

For production deployments (Heroku, Vercel, etc.):

1. Set environment variables through the platform's dashboard
2. Never use `.env` files in production containers
3. Use platform-specific secret management services
4. Regularly rotate production secrets

## Troubleshooting

### Common Issues

1. **"Config validation error"** - Check that all required variables are set
2. **"MongoDB connection failed"** - Verify MONGODB_URI format and credentials
3. **"JWT verification failed"** - Ensure JWT_SECRET is set and consistent
4. **"Email sending failed"** - Check SMTP credentials and firewall settings

### Validation

The app automatically validates environment variables on startup. Check the console output for any validation errors.

## Example Complete .env File

```bash
# ========================================
# EYES APP ENVIRONMENT VARIABLES
# ========================================

# Environment
NODE_ENV=development

# MongoDB Configuration
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=mySecurePassword123
MONGO_DATABASE=eyes_app
MONGODB_URI=mongodb://root:mySecurePassword123@mongodb:27017/eyes_app?authSource=admin

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Port Configuration
PORT=5000
BACKEND_PORT=5001
FRONTEND_PORT=80

# Backend URL for frontend
BACKEND_URL=http://backend:5000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_FROM_NAME=Eyes App

# Client URL
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Next Steps

1. Create your `.env` file with the above variables
2. Update the values with your actual configuration
3. Test the application to ensure all variables are working
4. Set up production environment variables when deploying

## Support

If you encounter issues with environment variable configuration:
1. Check the console output for validation errors
2. Verify all required variables are set
3. Ensure variable names match exactly (case-sensitive)
4. Check for typos in values

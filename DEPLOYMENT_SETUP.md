# Deployment Setup Guide 🚀

## Overview
This guide covers multiple deployment options for your Eyes app, including Docker, Vercel, Heroku, and manual deployment.

## Deployment Options

### 1. 🐳 Docker Deployment (Recommended for Production)

#### Prerequisites
- Docker and Docker Compose installed
- Environment variables configured in `.env`

#### Quick Deploy
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Using deployment script
./deploy.sh production
```

#### Docker Services
- **MongoDB**: Database service with persistent storage
- **Backend**: Node.js API server
- **Frontend**: React app served by Nginx

### 2. ☁️ Vercel Deployment (Frontend)

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd react-codebase/eyes
vercel

# Or deploy from root with existing config
vercel --prod
```

#### Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**: Set in Vercel dashboard

### 3. 🦊 Heroku Deployment

#### Backend Deployment
```bash
# Create Heroku app
heroku create your-eyes-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### Frontend Deployment
```bash
# Create separate app for frontend
heroku create your-eyes-frontend

# Set buildpack
heroku buildpacks:set mars/create-react-app

# Deploy
git push heroku main
```

### 4. 🐙 GitHub Actions (CI/CD)

#### Workflow Setup
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Eyes App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Environment-Specific Configurations

### Development Environment
```bash
# Environment: development
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eyes_app
JWT_SECRET=dev_secret_key
```

### Staging Environment
```bash
# Environment: staging
NODE_ENV=staging
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eyes_app_staging
JWT_SECRET=staging_secret_key
```

### Production Environment
```bash
# Environment: production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eyes_app_prod
JWT_SECRET=production_secret_key
```

## Deployment Scripts

### 1. Docker Deployment Script
```bash
#!/bin/bash
# deploy-docker.sh

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

echo "🚀 Deploying to $ENVIRONMENT..."

# Load environment variables
source .env

# Build and deploy
docker-compose -f "$COMPOSE_FILE" down
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "✅ Deployment complete!"
```

### 2. Vercel Deployment Script
```bash
#!/bin/bash
# deploy-vercel.sh

echo "🚀 Deploying to Vercel..."

cd react-codebase/eyes

# Build the app
npm run build

# Deploy to Vercel
vercel --prod

echo "✅ Vercel deployment complete!"
```

### 3. Heroku Deployment Script
```bash
#!/bin/bash
# deploy-heroku.sh

echo "🚀 Deploying to Heroku..."

# Deploy backend
cd server
git push heroku main

# Deploy frontend
cd ../react-codebase/eyes
git push heroku main

echo "✅ Heroku deployment complete!"
```

## Production Checklist

### Security
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation active

### Performance
- [ ] Database indexes optimized
- [ ] Static assets compressed
- [ ] CDN configured (if applicable)
- [ ] Caching strategies implemented

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Health checks active
- [ ] Log aggregation

## Troubleshooting

### Common Issues

#### Docker
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart service
docker-compose restart [service_name]
```

#### Vercel
```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment_url]

# Rollback
vercel rollback [deployment_id]
```

#### Heroku
```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Restart app
heroku restart
```

## Next Steps

1. **Choose Deployment Strategy**: Docker for full control, Vercel for simplicity
2. **Set Up CI/CD**: GitHub Actions for automated deployments
3. **Configure Monitoring**: Set up error tracking and performance monitoring
4. **Test Deployment**: Verify all environments work correctly
5. **Set Up Domains**: Configure custom domains for production

## Support

- **Docker Issues**: Check container logs and health checks
- **Vercel Issues**: Check build logs and environment variables
- **Heroku Issues**: Check app logs and dyno status
- **General Issues**: Review environment configuration and dependencies

#!/bin/bash

# Heroku Deployment Script for Eyes App
# Usage: ./deploy-heroku.sh [app-name] [environment]

set -e

APP_NAME=${1:-eyes-app}
ENVIRONMENT=${2:-production}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Eyes App to Heroku (${ENVIRONMENT})...${NC}"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI not found. Please install it first:${NC}"
    echo -e "${YELLOW}https://devcenter.heroku.com/articles/heroku-cli${NC}"
    exit 1
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Heroku. Please login:${NC}"
    heroku login
fi

# Create or use existing app
echo -e "${BLUE}📱 Setting up Heroku app: ${APP_NAME}${NC}"

if heroku apps:info --app "$APP_NAME" &> /dev/null; then
    echo -e "${GREEN}✅ Using existing app: ${APP_NAME}${NC}"
else
    echo -e "${BLUE}🆕 Creating new app: ${APP_NAME}${NC}"
    heroku create "$APP_NAME"
fi

# Set environment variables
echo -e "${BLUE}🔧 Configuring environment variables...${NC}"

# Load from .env file if it exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}📋 Loading environment variables from .env...${NC}"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set required environment variables
heroku config:set NODE_ENV="$ENVIRONMENT" --app "$APP_NAME"
heroku config:set MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/eyes_app}" --app "$APP_NAME"
heroku config:set JWT_SECRET="${JWT_SECRET:-your_jwt_secret_key}" --app "$APP_NAME"
heroku config:set JWT_EXPIRES_IN="${JWT_EXPIRES_IN:-90d}" --app "$APP_NAME"
heroku config:set JWT_COOKIE_EXPIRES_IN="${JWT_COOKIE_EXPIRES_IN:-90}" --app "$APP_NAME"

# Deploy backend
echo -e "${BLUE}🔧 Deploying backend...${NC}"
cd server

# Set buildpack for Node.js
heroku buildpacks:set heroku/nodejs --app "$APP_NAME"

# Add MongoDB addon if not using external MongoDB
if [[ "$MONGODB_URI" == *"localhost"* ]] || [[ "$MONGODB_URI" == *"mongodb:27017"* ]]; then
    echo -e "${YELLOW}⚠️  Adding MongoDB addon...${NC}"
    heroku addons:create mongolab:sandbox --app "$APP_NAME"
fi

# Deploy backend
echo -e "${BLUE}📤 Pushing backend to Heroku...${NC}"
git add .
git commit -m "Deploy backend to Heroku - $(date)" || true
git push heroku main

# Check backend status
echo -e "${BLUE}📊 Backend status:${NC}"
heroku ps --app "$APP_NAME"

# Go back to root
cd ..

# Deploy frontend (separate app)
echo -e "${BLUE}🌐 Setting up frontend app...${NC}"
FRONTEND_APP_NAME="${APP_NAME}-frontend"

if heroku apps:info --app "$FRONTEND_APP_NAME" &> /dev/null; then
    echo -e "${GREEN}✅ Using existing frontend app: ${FRONTEND_APP_NAME}${NC}"
else
    echo -e "${BLUE}🆕 Creating new frontend app: ${FRONTEND_APP_NAME}${NC}"
    heroku create "$FRONTEND_APP_NAME"
fi

# Deploy frontend
echo -e "${BLUE}🌐 Deploying frontend...${NC}"
cd react-codebase/eyes

# Set buildpack for React
heroku buildpacks:set mars/create-react-app --app "$FRONTEND_APP_NAME"

# Set frontend environment variables
heroku config:set REACT_APP_API_URL="https://${APP_NAME}.herokuapp.com" --app "$FRONTEND_APP_NAME"
heroku config:set NODE_ENV="$ENVIRONMENT" --app "$FRONTEND_APP_NAME"

# Deploy frontend
echo -e "${BLUE}📤 Pushing frontend to Heroku...${NC}"
git add .
git commit -m "Deploy frontend to Heroku - $(date)" || true
git push heroku main

# Check frontend status
echo -e "${BLUE}📊 Frontend status:${NC}"
heroku ps --app "$FRONTEND_APP_NAME"

# Go back to root
cd ../..

echo -e "${GREEN}✅ Heroku deployment complete!${NC}"
echo ""
echo -e "${BLUE}🔗 Your apps:${NC}"
echo -e "${YELLOW}Backend:  https://${APP_NAME}.herokuapp.com${NC}"
echo -e "${YELLOW}Frontend: https://${FRONTEND_APP_NAME}.herokuapp.com${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "${YELLOW}1. Configure custom domains${NC}"
echo -e "${YELLOW}2. Set up monitoring and logging${NC}"
echo -e "${YELLOW}3. Configure SSL certificates${NC}"
echo ""
echo -e "${BLUE}🔗 Useful commands:${NC}"
echo -e "${YELLOW}heroku logs --tail --app ${APP_NAME}        # Backend logs${NC}"
echo -e "${YELLOW}heroku logs --tail --app ${FRONTEND_APP_NAME} # Frontend logs${NC}"
echo -e "${YELLOW}heroku open --app ${APP_NAME}               # Open backend${NC}"
echo -e "${YELLOW}heroku open --app ${FRONTEND_APP_NAME}      # Open frontend${NC}"

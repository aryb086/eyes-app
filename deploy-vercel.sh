#!/bin/bash

# Vercel Deployment Script for Eyes App Frontend
# Usage: ./deploy-vercel.sh [environment]

set -e

ENVIRONMENT=${1:-production}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Eyes App Frontend to Vercel (${ENVIRONMENT})...${NC}"

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Navigate to frontend directory
cd react-codebase/eyes

echo -e "${BLUE}📁 Building React app...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the app
echo -e "${BLUE}🔨 Building production bundle...${NC}"
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build failed! No build directory found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Vercel
echo -e "${BLUE}☁️  Deploying to Vercel...${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
else
    vercel
fi

echo -e "${GREEN}✅ Vercel deployment complete!${NC}"

# Go back to root directory
cd ../..

echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "${YELLOW}1. Set environment variables in Vercel dashboard${NC}"
echo -e "${YELLOW}2. Configure custom domain (if needed)${NC}"
echo -e "${YELLOW}3. Set up monitoring and analytics${NC}"
echo ""
echo -e "${BLUE}🔗 Useful commands:${NC}"
echo -e "${YELLOW}vercel ls                    # List deployments${NC}"
echo -e "${YELLOW}vercel logs [url]           # View logs${NC}"
echo -e "${YELLOW}vercel rollback [id]        # Rollback deployment${NC}"

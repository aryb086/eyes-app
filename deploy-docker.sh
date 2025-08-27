#!/bin/bash

# Docker Deployment Script for Eyes App
# Usage: ./deploy-docker.sh [environment]
# Environments: development, staging, production

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Eyes App to ${ENVIRONMENT} environment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Compose file $COMPOSE_FILE not found!${NC}"
    echo -e "${YELLOW}Available environments:${NC}"
    ls docker-compose.*.yml 2>/dev/null | sed 's/docker-compose\.//' | sed 's/\.yml//' || echo "No production compose files found"
    exit 1
fi

# Load environment variables if .env exists
if [ -f ".env" ]; then
    echo -e "${BLUE}📋 Loading environment variables from .env file...${NC}"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Clean up old images (optional)
read -p "🧹 Clean up old Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
    docker system prune -f
fi

# Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d --build

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 15

# Check service status
echo -e "${BLUE}📊 Service status:${NC}"
docker-compose -f "$COMPOSE_FILE" ps

# Health check
echo -e "${YELLOW}🏥 Running health checks...${NC}"
sleep 5

# Check if services are responding
if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
    echo -e "${BLUE}🔍 Checking service health...${NC}"
    
    # Check backend health
    if curl -f "http://localhost:${BACKEND_PORT:-5001}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend health check failed (may still be starting)${NC}"
    fi
    
    # Check frontend health
    if curl -f "http://localhost:${FRONTEND_PORT:-80}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend health check failed (may still be starting)${NC}"
    fi
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}🌐 Frontend: http://localhost:${FRONTEND_PORT:-80}${NC}"
echo -e "${BLUE}🔧 Backend: http://localhost:${BACKEND_PORT:-5001}${NC}"
echo -e "${BLUE}🗄️  MongoDB: localhost:27017${NC}"
echo ""
echo -e "${YELLOW}📝 View logs: docker-compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "${YELLOW}🛑 Stop services: docker-compose -f $COMPOSE_FILE down${NC}"
echo -e "${YELLOW}📊 Monitor resources: docker stats${NC}"

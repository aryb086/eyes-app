#!/bin/bash

# Deployment script for Congressional App
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

echo "🚀 Deploying Congressional App to $ENVIRONMENT environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Compose file $COMPOSE_FILE not found!"
    echo "Available environments:"
    ls docker-compose.*.yml 2>/dev/null | sed 's/docker-compose\.//' | sed 's/\.yml//' || echo "No production compose files found"
    exit 1
fi

# Load environment variables if .env exists
if [ -f ".env" ]; then
    echo "📋 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f "$COMPOSE_FILE" up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service status:"
docker-compose -f "$COMPOSE_FILE" ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 Frontend: http://localhost:${FRONTEND_PORT:-80}"
echo "🔧 Backend: http://localhost:${BACKEND_PORT:-5001}"
echo "🗄️  MongoDB: localhost:27017"
echo ""
echo "📝 View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "🛑 Stop services: docker-compose -f $COMPOSE_FILE down" 
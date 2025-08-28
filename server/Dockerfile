# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.17.1

# Production stage
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application in production mode
CMD ["npm", "start"]

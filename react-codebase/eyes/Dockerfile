# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variable for API URL (can be overridden at runtime)
ENV REACT_APP_API_URL=/api/v1

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache bash gettext

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy nginx config directly
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

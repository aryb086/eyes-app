# Docker Deployment Guide

This guide explains how to deploy your full-stack congressional app using Docker to various platforms like Vercel, Heroku, and others.

## 🚀 Quick Start

### 1. Local Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Production Build
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Build and start with custom env vars
BACKEND_URL=https://your-backend.com docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# MongoDB
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DATABASE=eyes_app
MONGODB_URI=mongodb://root:password@mongodb:27017/eyes_app?authSource=admin

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Ports
PORT=5000
BACKEND_PORT=5001
FRONTEND_PORT=80

# Backend URL for frontend
BACKEND_URL=http://backend:5000
```

## 🐳 Docker Configuration Files

- **`docker-compose.yml`** - Development setup with hot reload
- **`docker-compose.prod.yml`** - Production setup with environment variables
- **`docker-compose.heroku.yml`** - Heroku-specific configuration

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Backend Service

#### Frontend to Vercel:
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend.com/api/v1`

#### Backend to any service:
- Heroku, Railway, DigitalOcean, AWS, etc.
- Set `NODE_ENV=production`
- Set `MONGODB_URI` to your MongoDB instance
- Set `JWT_SECRET`

### Option 2: Heroku (Full Stack)

1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
```

4. Deploy:
```bash
git push heroku main
```

### Option 3: Docker Compose on VPS

1. SSH to your VPS
2. Clone repository
3. Set environment variables
4. Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Customization

### Backend URL Configuration

The frontend automatically detects the backend URL through environment variables:

- **Local**: `http://backend:5000`
- **Production**: `https://your-backend-domain.com`
- **Custom**: Set `BACKEND_URL` environment variable

### MongoDB Options

- **Local**: Use the MongoDB container in docker-compose
- **Atlas**: Set `MONGODB_URI` to your Atlas connection string
- **Other**: Any MongoDB-compatible database

## 📁 File Structure

```
congressional_app/
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
├── docker-compose.heroku.yml   # Heroku
├── server/
│   └── Dockerfile             # Backend container
├── react-codebase/eyes/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx config template
│   └── docker-entrypoint.sh   # Startup script
├── vercel.json                # Vercel config
├── app.json                   # Heroku config
└── env.example                # Environment template
```

## 🚨 Important Notes

1. **Never commit `.env` files** - they contain secrets
2. **Use strong JWT secrets** in production
3. **Set up proper CORS** for your domains
4. **Use HTTPS** in production
5. **Monitor logs** for debugging

## 🔍 Troubleshooting

### Common Issues:

1. **Frontend can't connect to backend**:
   - Check `BACKEND_URL` environment variable
   - Verify backend is running and accessible
   - Check CORS settings

2. **MongoDB connection failed**:
   - Verify `MONGODB_URI` is correct
   - Check network connectivity
   - Verify credentials

3. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

### Debug Commands:

```bash
# Check container status
docker ps

# View container logs
docker logs container_name

# Access container shell
docker exec -it container_name sh

# Check environment variables
docker exec container_name env
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Heroku Container Registry](https://devcenter.heroku.com/articles/container-registry-and-runtime)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/) 
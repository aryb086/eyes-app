# 🚀 Quick Deploy Guide

## Get Your Eyes App Running in 5 Minutes!

### Option 1: Docker (Recommended for Beginners)

```bash
# 1. Start everything with one command
./deploy-docker.sh development

# 2. Access your app
# Frontend: http://localhost:80
# Backend: http://localhost:5001
# MongoDB: localhost:27017
```

### Option 2: Vercel (Frontend Only - Easiest)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
./deploy-vercel.sh

# 3. Your app will be live at a Vercel URL
```

### Option 3: Heroku (Full Stack)

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Deploy everything
./deploy-heroku.sh my-eyes-app

# 4. Your app will be live at Heroku URLs
```

## 🎯 What Just Happened?

- **Docker**: Created containers for MongoDB, Node.js backend, and React frontend
- **Vercel**: Built and deployed your React app to their global CDN
- **Heroku**: Deployed both backend and frontend to their cloud platform

## 🔧 Customize Your Deployment

### Environment Variables
Edit your `.env` file:
```bash
# MongoDB (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eyes_app

# JWT Secret (generate a new one!)
JWT_SECRET=your_super_secret_key_here

# Email settings
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Custom Domain
1. **Vercel**: Add domain in dashboard
2. **Heroku**: `heroku domains:add yourdomain.com`
3. **Docker**: Configure reverse proxy (nginx)

## 📱 Test Your Deployment

### Health Checks
```bash
# Docker
curl http://localhost:5001/health

# Vercel
curl https://your-app.vercel.app

# Heroku
curl https://your-app.herokuapp.com/health
```

### Frontend Test
- Open your app URL
- Try logging in/registering
- Check if API calls work

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :5001

# Kill the process
kill -9 [PID]
```

**Docker Issues**
```bash
# Restart Docker
docker system prune -a
docker-compose down
docker-compose up -d
```

**Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Get Help
- Check logs: `docker-compose logs -f`
- Verify environment: `echo $MONGODB_URI`
- Test database: `mongosh $MONGODB_URI`

## 🎉 Next Steps

1. **Monitor**: Set up Sentry for error tracking
2. **Scale**: Configure auto-scaling on Heroku
3. **Domain**: Add your custom domain
4. **SSL**: Ensure HTTPS is working
5. **Backup**: Set up database backups

## 🔗 Useful Commands

```bash
# Docker
./deploy-docker.sh [environment]    # Deploy
docker-compose ps                    # Status
docker-compose logs -f [service]    # Logs

# Vercel
vercel ls                           # List deployments
vercel logs [url]                   # View logs

# Heroku
heroku ps --app [app-name]          # App status
heroku logs --tail --app [app-name] # View logs
```

## 📞 Support

- **Docker Issues**: Check container logs and health
- **Vercel Issues**: Check build logs and environment
- **Heroku Issues**: Check app logs and dyno status
- **General**: Review environment configuration

---

**🎯 Goal**: Get your app running quickly, then optimize!
**⏱️  Time**: 5 minutes for basic deployment
**🚀 Result**: Live Eyes app accessible from anywhere!

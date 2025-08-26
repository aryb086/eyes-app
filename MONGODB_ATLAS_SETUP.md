# 🗄️ MongoDB Atlas Setup Guide

## 🚀 Quick Setup Steps

### 1. **Create MongoDB Atlas Account**
- Visit: https://www.mongodb.com/atlas
- Click "Try Free" or "Get Started Free"
- Sign up with email or Google/GitHub

### 2. **Create Free Cluster**
- **Plan**: Choose "FREE" tier (M0)
- **Cloud Provider**: AWS, Google Cloud, or Azure (any)
- **Region**: Choose closest to your users
- **Cluster Name**: `congressional-app-cluster`
- Click "Create"

### 3. **Set Up Database User**
- Left sidebar → "Database Access"
- Click "Add New Database User"
- **Username**: `congressional_user`
- **Password**: Create strong password (save this!)
- **Privileges**: "Read and write to any database"
- Click "Add User"

### 4. **Allow Network Access**
- Left sidebar → "Network Access"
- Click "Add IP Address"
- **IP Address**: "Allow Access from Anywhere" (for now)
- Click "Confirm"

### 5. **Get Connection String**
- Go to "Database" → Click "Connect" on cluster
- Choose "Connect your application"
- Copy the connection string

## 🔧 Update Your App

### **Option 1: Use the Script (Recommended)**
```bash
./update-mongodb.sh "mongodb+srv://congressional_user:YOUR_PASSWORD@cluster.mongodb.net/eyes_app?retryWrites=true&w=majority"
```

### **Option 2: Manual Update**
```bash
heroku config:set MONGODB_URI="your_connection_string" --app congressional-app-backend
heroku restart --app congressional-app-backend
```

## 📝 Connection String Format

Your connection string should look like this:
```
mongodb+srv://congressional_user:YOUR_PASSWORD@congressional-app-cluster.xxxxx.mongodb.net/eyes_app?retryWrites=true&w=majority
```

**Important**: 
- Replace `YOUR_PASSWORD` with your actual password
- Replace `eyes_app` with your desired database name
- Keep the `?retryWrites=true&w=majority` part

## ✅ Verification

After updating, check if it worked:
```bash
# Check current config
heroku config --app congressional-app-backend

# Check logs for any errors
heroku logs --tail --app congressional-app-backend

# Test your API endpoint
curl https://congressional-app-backend-ff9b28494ff1.herokuapp.com/api/v1/health
```

## 🆘 Troubleshooting

### **Common Issues:**

1. **Connection Failed**: Check if password is correct
2. **Network Access**: Ensure IP is allowed (or use "Allow from Anywhere")
3. **User Permissions**: Make sure user has read/write access
4. **Database Name**: Ensure database name in URI matches what your app expects

### **Need Help?**
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Heroku Logs: `heroku logs --tail --app congressional-app-backend`
- Test locally first with MongoDB Compass

## 🎯 Next Steps

Once MongoDB is connected:
1. Your backend will automatically create the database and collections
2. Test user registration/login
3. Test post creation and retrieval
4. Monitor logs for any errors

## 🌐 Your App URLs

- **Frontend**: https://eyes-lb2mmqjz1-aryb086s-projects.vercel.app
- **Backend**: https://congressional-app-backend-ff9b28494ff1.herokuapp.com/
- **MongoDB Atlas**: Check your dashboard for cluster status 
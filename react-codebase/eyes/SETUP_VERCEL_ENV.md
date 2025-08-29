# 🚀 Vercel Environment Variables Setup

## 🔧 **Critical: Set These Environment Variables in Vercel Dashboard**

Your app is failing because these environment variables are not set in Vercel. Follow these steps:

### **Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `eyes-app` project
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add These Environment Variables**

| Variable Name | Value |
|---------------|-------|
| `REACT_APP_API_BASE_URL` | `https://eyes-app-backend-9f922055ebf7.herokuapp.com/api/v1` |
| `REACT_APP_WEBSOCKET_URL` | `wss://eyes-websocket-server-5e12aa3ae96e.herokuapp.com` |

### **Step 3: Deploy**
1. After adding the variables, redeploy your app
2. The API errors should be resolved

## 🚨 **Why This Happened**

- React apps require environment variables to start with `REACT_APP_`
- These variables must be set in the deployment platform (Vercel)
- Local `.env.local` files don't work in production
- Without these variables, the API URL becomes `undefined`

## ✅ **After Setup**

Your app should:
- ✅ Connect to the backend API properly
- ✅ Show posts in all feeds
- ✅ Handle comments and likes correctly
- ✅ Display location names properly

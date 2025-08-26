#!/bin/bash

# Script to update MongoDB URI in Heroku
# Usage: ./update-mongodb.sh "your_mongodb_connection_string"

if [ -z "$1" ]; then
    echo "❌ Please provide your MongoDB connection string"
    echo "Usage: ./update-mongodb.sh \"mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority\""
    echo ""
    echo "🔍 To get your connection string:"
    echo "1. Go to MongoDB Atlas dashboard"
    echo "2. Click 'Connect' on your cluster"
    echo "3. Choose 'Connect your application'"
    echo "4. Copy the connection string"
    echo "5. Replace <password> with your actual password"
    echo "6. Replace <dbname> with 'eyes_app'"
    exit 1
fi

MONGODB_URI="$1"

echo "🚀 Updating MongoDB URI in Heroku..."
echo "📝 New URI: $MONGODB_URI"

# Update the MongoDB URI in Heroku
heroku config:set MONGODB_URI="$MONGODB_URI" --app congressional-app-backend

echo ""
echo "✅ MongoDB URI updated successfully!"
echo "🔄 Restarting the application..."

# Restart the app to pick up the new configuration
heroku restart --app congressional-app-backend

echo ""
echo "🎉 Your app is now connected to MongoDB Atlas!"
echo "🌐 Frontend: https://eyes-lb2mmqjz1-aryb086s-projects.vercel.app"
echo "🔧 Backend: https://congressional-app-backend-ff9b28494ff1.herokuapp.com/"
echo ""
echo "📊 Check the logs: heroku logs --tail --app congressional-app-backend" 
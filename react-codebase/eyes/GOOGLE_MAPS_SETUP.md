# Google Maps API Setup Guide

This guide will help you set up Google Maps API for real geocoding and location detection in the EYES app.

## 🚀 Features Enabled with Google Maps API

- **Real Address Geocoding**: Convert any address to precise coordinates
- **Reverse Geocoding**: Convert GPS coordinates to readable addresses
- **Dynamic Location Detection**: Automatically detect city and neighborhood from any address
- **Nearby Neighborhoods**: Find real neighborhoods near any location
- **Location Containers**: Create dynamic post containers based on real geographic data

## 📋 Prerequisites

1. Google Cloud Platform account
2. Billing enabled on your Google Cloud project
3. Access to Google Maps Platform

## 🔧 Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project

### 2. Enable Required APIs

Enable these APIs in your Google Cloud project:

- **Geocoding API**: For address ↔ coordinates conversion
- **Places API**: For nearby neighborhood detection
- **Maps JavaScript API**: For future map features

```bash
# Using gcloud CLI (optional)
gcloud services enable geocoding-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
gcloud services enable maps-backend.googleapis.com
```

### 3. Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key

### 4. Restrict API Key (Recommended)

For security, restrict your API key:

1. Click on your API key to edit it
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domain(s):
   - `https://your-app.vercel.app/*`
   - `http://localhost:3000/*` (for development)
4. Under **API restrictions**, select **Restrict key**
5. Select the APIs you enabled (Geocoding API, Places API)

### 5. Add API Key to Environment Variables

#### For Development (Local)

Create a `.env.local` file in your project root:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add a new variable:
   - **Name**: `REACT_APP_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google Maps API key
   - **Environment**: Production, Preview, Development

### 6. Deploy Changes

After adding the environment variable, redeploy your app:

```bash
vercel --prod
```

## 🧪 Testing the Integration

### Test Address Geocoding

1. Go to the registration page
2. Enter an address like "123 Main St, New York, NY"
3. The system should detect the city and neighborhood

### Test Auto-Detection

1. Go to location setup or user settings
2. Click "Auto-detect location"
3. Allow location access in your browser
4. The system should detect your current location

### Test Location Containers

1. Create a post with location data
2. The system should create or find the appropriate location container
3. Posts should be grouped by real geographic boundaries

## 🔍 Fallback Mode

If the Google Maps API key is not available, the system will use fallback mode:

- **Simple text matching** for common cities
- **Predefined neighborhood lists** for major cities
- **Default coordinates** for unknown locations

This ensures the app works even without the API key, but with limited accuracy.

## 💰 Cost Considerations

Google Maps API pricing (as of 2024):

- **Geocoding API**: $5 per 1,000 requests
- **Places API**: $17 per 1,000 requests
- **Free tier**: $200 monthly credit

For a typical app with 1,000 users:
- ~5,000 geocoding requests/month = $25
- ~2,000 places requests/month = $34
- **Total**: ~$59/month (within free tier)

## 🛠️ Troubleshooting

### Common Issues

1. **"API key not available" warning**
   - Check that `REACT_APP_GOOGLE_MAPS_API_KEY` is set correctly
   - Verify the environment variable is deployed

2. **"Geocoding failed" errors**
   - Check API key restrictions
   - Verify billing is enabled
   - Check API quotas

3. **"Places API failed" errors**
   - Ensure Places API is enabled
   - Check API key has Places API access

### Debug Mode

Enable debug logging by checking the browser console for:
- API request URLs
- Response data
- Fallback mode activation

## 🔒 Security Best Practices

1. **Restrict API key** to your domains only
2. **Set up billing alerts** to monitor usage
3. **Use environment variables** (never commit API keys to code)
4. **Monitor API usage** in Google Cloud Console
5. **Implement rate limiting** if needed

## 📚 Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Geocoding API Guide](https://developers.google.com/maps/documentation/geocoding)
- [Places API Guide](https://developers.google.com/maps/documentation/places/web-service)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

## 🎯 Next Steps

Once Google Maps API is working:

1. **Test with real addresses** from different cities
2. **Monitor API usage** and costs
3. **Consider implementing caching** for frequently accessed locations
4. **Add map visualization** features
5. **Implement location-based notifications**

---

**Note**: The app will work without the Google Maps API key using fallback mode, but for the best user experience and accurate location detection, we recommend setting up the API key.

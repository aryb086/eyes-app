# OAuth Setup Guide for Eyes App

This guide will help you set up Google and GitHub OAuth authentication for your Eyes app.

## Prerequisites

- A deployed Eyes app (frontend and backend)
- Access to Google Cloud Console
- Access to GitHub Developer Settings

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the following:
   - **Name**: Eyes App OAuth
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - `https://your-app-domain.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-app-domain.vercel.app/auth/callback` (for production)

### 3. Get Client ID

Copy the generated Client ID from the credentials page.

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: Eyes App
   - **Homepage URL**: `https://your-app-domain.vercel.app`
   - **Authorization callback URL**: `https://your-app-domain.vercel.app/auth/callback`
   - **Application description**: Eyes App OAuth Integration

### 2. Get Client ID

Copy the generated Client ID from the OAuth app page.

## Environment Variables

Create a `.env` file in your `react-codebase/eyes` directory with the following variables:

```bash
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.herokuapp.com/api/v1

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# GitHub OAuth
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id_here
```

## Backend OAuth Endpoints

Your backend needs to implement the following endpoints:

### Google OAuth
```
POST /api/v1/auth/google
Body: { "accessToken": "google_access_token" }
```

### GitHub OAuth
```
POST /api/v1/auth/github
Body: { "code": "github_authorization_code" }
```

## Testing OAuth

1. **Development**: 
   - Set up local environment variables
   - Test with `http://localhost:3000`

2. **Production**:
   - Set environment variables in Vercel
   - Test with your deployed domain

## Troubleshooting

### Common Issues

1. **"OAuth is not configured" error**
   - Check that environment variables are set correctly
   - Verify the variable names match exactly

2. **Redirect URI mismatch**
   - Ensure redirect URIs in Google/GitHub match your app exactly
   - Check for trailing slashes or protocol mismatches

3. **CORS issues**
   - Verify your backend allows requests from your frontend domain
   - Check that CORS headers are properly configured

### Security Considerations

1. **Client IDs are public** - It's safe to include them in frontend code
2. **Never expose client secrets** - These should only be in your backend
3. **Use HTTPS in production** - OAuth providers require secure connections
4. **Validate tokens** - Always verify OAuth tokens on your backend

## Next Steps

After setting up OAuth:

1. Deploy your updated frontend
2. Test the OAuth flow end-to-end
3. Implement proper error handling
4. Add user profile creation for OAuth users
5. Consider adding more OAuth providers (Facebook, Twitter, etc.)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are loaded
3. Test OAuth URLs manually
4. Check backend logs for authentication errors

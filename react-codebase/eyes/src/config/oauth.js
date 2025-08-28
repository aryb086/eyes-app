// OAuth Configuration
// To enable Google and GitHub OAuth, you need to:

// 1. Set up Google OAuth:
// - Go to https://console.developers.google.com/
// - Create a new project or select existing one
// - Enable Google+ API
// - Create OAuth 2.0 credentials
// - Add your domain to authorized origins
// - Set REACT_APP_GOOGLE_CLIENT_ID in your .env file

// 2. Set up GitHub OAuth:
// - Go to https://github.com/settings/developers
// - Create a new OAuth App
// - Set Homepage URL to your app domain
// - Set Authorization callback URL to your_app_domain/auth/callback
// - Set REACT_APP_GITHUB_CLIENT_ID in your .env file

export const oauthConfig = {
  google: {
    clientId: '899675673892-hq5n5981vs1b14i82krmoe42j619jq17.apps.googleusercontent.com',
    enabled: true,
  },
  github: {
    clientId: 'Ov23liXo617YNO4flFpn',
    enabled: true,
  }
};

export const isOAuthEnabled = oauthConfig.google.enabled || oauthConfig.github.enabled;

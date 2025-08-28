import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { oauthService } from '../services/oauthService';
import ModernCard from '../components/ui/ModernCard';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const oauthState = searchParams.get('state');

        if (error) {
          setError(`Authentication failed: ${error}`);
          setStatus('Authentication failed');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('Authentication failed');
          return;
        }

        setStatus('Authenticating...');

        // Determine which OAuth provider based on the state parameter
        let authResult;

        if (oauthState === 'github') {
          authResult = await oauthService.githubAuth(code);
        } else if (oauthState === 'google') {
          authResult = await oauthService.googleAuth(code);
        } else {
          // Fallback: try to determine from referrer
          const referrer = document.referrer;
          if (referrer.includes('github.com')) {
            authResult = await oauthService.githubAuth(code);
          } else {
            authResult = await oauthService.googleAuth(code);
          }
        }

        if (authResult.success) {
          setStatus('Authentication successful!');
          // Store the token and redirect
          await login(authResult);
          navigate('/feed');
        } else {
          setError(authResult.message || 'Authentication failed');
          setStatus('Authentication failed');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'An unexpected error occurred');
        setStatus('Authentication failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <ModernCard className="w-full max-w-md text-center bg-gray-800/50 border border-gray-700">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {status === 'Authentication successful!' ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : status === 'Authentication failed' ? (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {status === 'Authentication successful!' ? 'Welcome!' : 'Authentication'}
          </h2>
          <p className="text-gray-600">{status}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {status === 'Authentication failed' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      </ModernCard>
    </div>
  );
}

export default OAuthCallback;

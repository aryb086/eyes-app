import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import CustomButton from '../components/ui/Button';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  
  // Check if token is valid when component mounts
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Get token from URL params
        const urlToken = new URLSearchParams(location.search).get('token');
        
        if (!urlToken) {
          throw new Error('No reset token provided');
        }
        
        // Set the token in state
        setResetToken(urlToken);
        
        // For now, just set as valid - actual validation will happen on form submit
        // In a real app, you might want to validate the token here
        setIsValidToken(true);
      } catch (err) {
        console.error('Token validation error:', err);
        setError(err.message || 'Invalid or expired reset token');
        setIsValidToken(false);
      } finally {
        setIsLoadingToken(false);
      }
    };

    checkToken();
  }, [token, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.resetPassword(resetToken, { password });
      
      if (result.success) {
        toast.success('Your password has been reset successfully!');
        setMessage('Your password has been reset successfully. Redirecting to login...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              from: 'password-reset',
              message: 'Your password has been reset successfully. Please log in with your new password.'
            } 
          });
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingToken) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9fe7ff] mx-auto mb-4"></div>
          <p>Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#9fe7ff] mb-6">
            INVALID TOKEN
          </h1>
          <p className="text-gray-300 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            to="/forgot-password" 
            className="text-[#9fe7ff] hover:underline font-medium"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#9fe7ff] mb-2">
          RESET PASSWORD
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          Enter your new password below
        </p>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9fe7ff]"
              placeholder="Enter new password"
              required
              minLength="8"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9fe7ff]"
              placeholder="Confirm new password"
              required
              minLength="8"
            />
          </div>
          
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 bg-[#9fe7ff] hover:bg-[#89d1e8] text-gray-900 font-bold rounded-lg text-lg tracking-wide uppercase transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="text-center text-sm">
              <Link 
                to="/login" 
                className="font-medium text-[#9fe7ff] hover:text-white"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

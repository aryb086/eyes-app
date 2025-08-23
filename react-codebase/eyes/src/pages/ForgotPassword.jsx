import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from '../components/ui/Button';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.requestPasswordReset(email);
      
      if (result.success) {
        toast.success('Password reset email sent successfully!');
        setMessage('If an account exists with this email, you will receive a password reset link shortly.');
        
        // Clear the form
        setEmail('');
        
        // Optionally redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              from: 'forgot-password',
              message: 'Please check your email for the password reset link.'
            } 
          });
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to send password reset email');
      }
    } catch (err) {
      console.error('Password reset request error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send password reset email. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#9fe7ff] mb-2">
          RESET PASSWORD
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          Enter your email to receive a password reset link
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9fe7ff]"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 bg-[#9fe7ff] hover:bg-[#89d1e8] text-gray-900 font-bold rounded-lg text-lg tracking-wide uppercase transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;

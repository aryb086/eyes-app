import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/ui/Button';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/feed');
      } else {
        setError(result.message || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#9fe7ff] mb-2">
          WELCOME BACK
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          Log in to continue to your account
        </p>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fe7ff]"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9fe7ff]"
              required
            />
          </div>
          
          <div className="pt-2">
            <CustomButton 
              type="submit" 
              text={isLoading ? 'Logging in...' : 'Log In'}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-[#9fe7ff] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          
          <div className="mt-4">
            <Link 
              to="/forgot-password" 
              className="text-gray-400 hover:text-[#9fe7ff] text-sm"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

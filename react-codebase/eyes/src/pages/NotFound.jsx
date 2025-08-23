import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/ui/Button';

function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-[#9fe7ff] mb-4">404</h1>
      <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <CustomButton 
          text="Go to Feed"
          onClick={() => navigate('/feed')}
        />
        <CustomButton 
          text="Go Back"
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600"
        />
      </div>
    </div>
  );
}

export default NotFound;

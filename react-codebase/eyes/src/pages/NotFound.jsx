import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

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
        <Button 
          onClick={() => navigate('/feed')}
          className="bg-[#9fe7ff] hover:bg-[#7dd4e6] text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Feed
        </Button>
        <Button 
          onClick={() => navigate(-1)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default NotFound;

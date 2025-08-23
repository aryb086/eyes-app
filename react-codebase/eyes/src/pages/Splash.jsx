import React from 'react';
import { Link } from 'react-router-dom';
import CustomButton from '../components/ui/Button';

const Splash = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#9fe7ff] mb-2">
          WELCOME TO EYES
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          A platform designed to keep your neighborhood safe
        </p>
        
        <div className="space-y-6">
          <Link to="/register" className="block w-full">
            <CustomButton text="Get Started" className="w-full" />
          </Link>
          
          <div className="text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              to="/login" 
              className="font-medium text-[#9fe7ff] hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Splash;

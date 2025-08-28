import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiSearch } from 'react-icons/fi';
import ModernCard from '../components/ui/ModernCard';

function ChooseCity() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const cities = [
    'Seattle',
    'San Francisco', 
    'New York',
    'Los Angeles',
    'Chicago',
    'Austin'
  ];

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center">
          <Link to="/feed" className="mr-4">
            <FiArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Choose City</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        {/* City Options */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {filteredCities.map((city) => (
            <ModernCard 
              key={city}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedCity === city ? 'ring-2 ring-teal-500' : ''
              }`}
              onClick={() => setSelectedCity(city)}
            >
              <div className="p-4 flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-medium text-gray-900">{city}</span>
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Link to="/feed">
            <button 
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 ${
                selectedCity 
                  ? 'bg-teal-500 hover:bg-teal-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedCity}
            >
              Continue
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ChooseCity;

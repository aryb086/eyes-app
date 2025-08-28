import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import ModernCard from '../components/ui/ModernCard';

function ChooseNeighborhood() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Midtown');
  
  const neighborhoods = [
    'Downtown',
    'Midtown', 
    'Uptown',
    'Suburbia'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center">
          <Link to="/feed" className="mr-4">
            <FiArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Choose Neighborhood</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {neighborhoods.map((neighborhood) => (
            <ModernCard 
              key={neighborhood}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedNeighborhood === neighborhood ? 'ring-2 ring-teal-500' : ''
              }`}
              onClick={() => setSelectedNeighborhood(neighborhood)}
            >
              <div className="p-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">{neighborhood}</span>
                {selectedNeighborhood === neighborhood && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Link to="/feed">
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
              Continue
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ChooseNeighborhood;

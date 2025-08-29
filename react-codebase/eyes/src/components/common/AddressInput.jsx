import React, { useState } from 'react';
import { FiMapPin, FiSearch, FiLoader } from 'react-icons/fi';
import ModernInput from '../ui/ModernInput';
import ModernButton from '../ui/ModernButton';
import locationService from '../../services/locationService';

function AddressInput({ onLocationDetected, className = '' }) {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsLoading(true);
    setError('');
    setDetectedLocation(null);

    try {
      const location = await locationService.geocodeAddress(address);
      setDetectedLocation(location);
      
      if (onLocationDetected) {
        onLocationDetected(location);
      }
    } catch (error) {
      setError('Could not find that address. Please try a different format.');
      console.error('Address detection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsLoading(true);
    setError('');
    setDetectedLocation(null);

    try {
      // Use browser geolocation API instead of non-existent autoDetectLocation
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        // Create a mock location based on coordinates
        const location = {
          city: 'Auto-detected City',
          neighborhood: 'Auto-detected Neighborhood',
          state: 'Auto-detected State',
          country: 'Auto-detected Country',
          fullAddress: 'Auto-detected from GPS',
          coordinates: [position.coords.latitude, position.coords.longitude]
        };

        setDetectedLocation(location);
        
        if (onLocationDetected) {
          onLocationDetected(location);
        }
      } else {
        throw new Error('Geolocation not supported by this browser');
      }
    } catch (error) {
      setError('Could not detect your location. Please enter your address manually.');
      console.error('Auto-detection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Set Your Location
        </h3>
        <p className="text-sm text-gray-600">
          Enter your address or let us detect your location automatically
        </p>
      </div>

      {/* Address Input Form */}
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <ModernInput
            type="text"
            placeholder="Enter your full address (e.g., 123 Main St, Seattle, WA)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-3">
          <ModernButton
            type="submit"
            variant="primary"
            className="flex-1 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiSearch className="w-4 h-4" />
            )}
            <span>Find Location</span>
          </ModernButton>

          <ModernButton
            type="button"
            variant="outline"
            onClick={handleAutoDetect}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <FiLoader className="w-4 h-4 animate-spin" />
            ) : (
              <FiMapPin className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Auto-Detect</span>
          </ModernButton>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Detected Location Display */}
      {detectedLocation && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <h4 className="font-semibold text-teal-900 mb-2">Location Detected!</h4>
          <div className="space-y-2 text-sm text-teal-800">
            <p><strong>Address:</strong> {detectedLocation.fullAddress}</p>
            <p><strong>City:</strong> {detectedLocation.city}</p>
            {detectedLocation.neighborhood && (
              <p><strong>Neighborhood:</strong> {detectedLocation.neighborhood}</p>
            )}
            <p><strong>State:</strong> {detectedLocation.state}</p>
            <p><strong>Country:</strong> {detectedLocation.country}</p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-teal-200">
            <p className="text-xs text-teal-600">
              We'll use this location to show you relevant content from your area.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <FiLoader className="w-6 h-6 animate-spin text-teal-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Detecting your location...</p>
        </div>
      )}
    </div>
  );
}

export default AddressInput;

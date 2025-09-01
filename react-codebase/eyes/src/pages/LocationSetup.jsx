import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { 
  MapPin, 
  Search, 
  Check, 
  ArrowLeft, 
  Loader2, 
  Navigation,
  Home,
  Building2,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { detectLocationFromAddress, getNearbyNeighborhoods, autoDetectLocation, formatAddress } from '../utils/locationDetection';

const LocationSetup = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [nearbyNeighborhoods, setNearbyNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, updateUserLocation } = useAuth();



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
      const formattedAddress = formatAddress(address);
      const detectedLocation = await detectLocationFromAddress(formattedAddress);
      
      // Get nearby neighborhoods using coordinates
      const nearbyNeighborhoods = await getNearbyNeighborhoods(
        detectedLocation.coordinates[1], // latitude
        detectedLocation.coordinates[0], // longitude
        5000 // 5km radius
      );
      
      setDetectedLocation(detectedLocation);
      setNearbyNeighborhoods(nearbyNeighborhoods);
      setStep(2);
      toast.success('Location detected successfully!');
    } catch (err) {
      setError(err.message || 'Could not find that address. Please try a different format.');
      console.error('Address detection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsLoading(true);
    setError('');
    setDetectedLocation(null);

    try {
      // Use the new auto-detect function
      const location = await autoDetectLocation();
      
      // Get nearby neighborhoods using coordinates
      const nearbyNeighborhoods = await getNearbyNeighborhoods(
        location.coordinates[1], // latitude
        location.coordinates[0], // longitude
        5000 // 5km radius
      );
      
      setDetectedLocation(location);
      setNearbyNeighborhoods(nearbyNeighborhoods);
      setStep(2);
      toast.success('Location detected from GPS!');
    } catch (err) {
      setError(err.message || 'Could not detect your location. Please enter your address manually.');
      console.error('Auto-detection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNeighborhoodSelect = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
  };

  const handleContinue = async () => {
    if (!selectedNeighborhood) {
      toast.error('Please select a neighborhood');
      return;
    }

    setIsSaving(true);

    try {
      const locationData = {
        ...detectedLocation,
        neighborhood: selectedNeighborhood.name,
        neighborhoodId: selectedNeighborhood.id.toString()
      };

      // Save to localStorage first (this will work regardless of authentication)
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      // Try to save to backend if user is authenticated
      if (updateUserLocation && currentUser) {
        try {
          await updateUserLocation(locationData);
        } catch (backendError) {
          console.warn('Backend location update failed, but local storage saved:', backendError);
          // Continue anyway since we saved to localStorage
        }
      }
      
      toast.success('Location set successfully!');
      navigate('/feed');
    } catch (err) {
      console.error('Error saving location:', err);
      toast.error('Failed to save location. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Your Location</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Help us show you relevant content from your area by setting your location
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step > 2 ? <Check className="h-5 w-5" /> : '2'}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1 ? 'Enter Your Address' : 'Choose Your Neighborhood'}
            </h2>
            <p className="text-gray-600">
              {step === 1 
                ? 'We\'ll use this to find your city and nearby neighborhoods'
                : 'Select the neighborhood that best matches your location'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Address Input */}
            {step === 1 && (
              <div className="space-y-6">
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter your full address (e.g., 123 Main St, Seattle, WA)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10 h-12 text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Find Location
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutoDetect}
                      disabled={isLoading}
                      className="h-12 px-4"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>

                {error && (
                  <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {/* Skip Option */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Neighborhood Selection */}
            {step === 2 && detectedLocation && (
              <div className="space-y-6">
                {/* Detected Location Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-green-900 mb-1">Location Detected</h3>
                      <div className="text-sm text-green-800 space-y-1">
                        <p><strong>Address:</strong> {detectedLocation.address}</p>
                        <p><strong>City:</strong> {detectedLocation.city}, {detectedLocation.state}</p>
                        <p><strong>Detected Neighborhood:</strong> {detectedLocation.neighborhood}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Neighborhood Selection */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Nearby Neighborhoods</h3>
                  <div className="space-y-3">
                    {nearbyNeighborhoods.map((neighborhood) => (
                      <div
                        key={neighborhood.id}
                        onClick={() => handleNeighborhoodSelect(neighborhood)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedNeighborhood?.id === neighborhood.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{neighborhood.name}</p>
                              <p className="text-sm text-gray-500">{neighborhood.distance} away</p>
                            </div>
                          </div>
                          {selectedNeighborhood?.id === neighborhood.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedNeighborhood || isSaving}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationSetup;

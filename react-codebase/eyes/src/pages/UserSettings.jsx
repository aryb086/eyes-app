import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { 
  Eye, 
  MapPin, 
  User, 
  Settings, 
  ArrowLeft, 
  Save, 
  Trash2, 
  Loader2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Navigation,
  Home,
  Building2,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { detectLocationFromAddress, getNearbyNeighborhoods, autoDetectLocation, formatAddress } from '../utils/locationDetection';

const UserSettings = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserLocation } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [nearbyNeighborhoods, setNearbyNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [error, setError] = useState('');

  // Get user location from currentUser or localStorage
  const userLocation = currentUser?.city && currentUser?.neighborhood ? {
    city: currentUser.city,
    neighborhood: currentUser.neighborhood,
    address: currentUser.address,
    state: currentUser.stateCode,
    country: currentUser.country,
    zipCode: currentUser.zipCode
  } : JSON.parse(localStorage.getItem('userLocation') || 'null');

  useEffect(() => {
    if (userLocation?.address) {
      setAddress(userLocation.address);
    }
  }, [userLocation]);



  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Please enter an address');
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
      setShowLocationForm(false);
      toast.success('Location detected successfully!');
    } catch (err) {
      toast.error(err.message || 'Could not find that address. Please try a different format.');
      console.error('Address detection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsLoading(true);
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
      setShowLocationForm(false);
      toast.success('Location detected from GPS!');
    } catch (error) {
      toast.error(error.message || 'Could not detect your location. Please enter your address manually.');
      console.error('Auto-detection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNeighborhoodSelect = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
  };

  const handleSaveLocation = async () => {
    if (!selectedNeighborhood) {
      toast.error('Please select a neighborhood');
      return;
    }

    setIsLoading(true);

    try {
      const locationData = {
        ...detectedLocation,
        neighborhood: selectedNeighborhood.name,
        neighborhoodId: selectedNeighborhood.place_id || selectedNeighborhood.id || selectedNeighborhood.name
      };

      // Save to backend
      if (updateUserLocation) {
        await updateUserLocation(locationData);
      }

      // Save to localStorage as fallback
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      toast.success('Location updated successfully!');
      setShowLocationForm(false);
      setDetectedLocation(null);
      setSelectedNeighborhood(null);
    } catch (err) {
      console.error('Error saving location:', err);
      toast.error('Failed to save location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLocation = () => {
    localStorage.removeItem('userLocation');
    setAddress('');
    toast.success('Location cleared');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  // Get user data with fallbacks
  const userEmail = currentUser?.email || 'Not available';
  const userId = currentUser?.id || currentUser?._id || 'Not available';
  const userName = currentUser?.name || currentUser?.username || 'User';
  const userUsername = currentUser?.username || 'Not available';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/feed')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">EYES</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">User Settings</h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid gap-6">
          
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={userName}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    value={userUsername}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">User ID</label>
                  <Input
                    value={userId}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Management Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Management</span>
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {showLocationForm ? (
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter your full address (e.g., 123 Main St, Seattle, WA)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAddressSubmit}
                      disabled={isLoading || !address.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Find Location
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleAutoDetect}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-2" />
                      )}
                      Auto-Detect
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowLocationForm(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>

                  {/* Neighborhood Selection */}
                  {detectedLocation && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900 mb-1">Location Detected</h4>
                            <div className="text-sm text-green-800 space-y-1">
                              <p><strong>Address:</strong> {detectedLocation.address}</p>
                              <p><strong>City:</strong> {detectedLocation.city}, {detectedLocation.state}</p>
                              <p><strong>Detected Neighborhood:</strong> {detectedLocation.neighborhood}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Select Your Neighborhood</h4>
                        <div className="space-y-2">
                          {nearbyNeighborhoods.map((neighborhood, index) => (
                            <div
                              key={neighborhood.place_id || neighborhood.id || index}
                              onClick={() => handleNeighborhoodSelect(neighborhood)}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedNeighborhood?.name === neighborhood.name
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Building2 className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-900">{neighborhood.name}</p>
                                    <p className="text-sm text-gray-500">{neighborhood.distance}m away</p>
                                  </div>
                                </div>
                                {selectedNeighborhood?.name === neighborhood.name && (
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDetectedLocation(null);
                            setSelectedNeighborhood(null);
                          }}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSaveLocation}
                          disabled={!selectedNeighborhood || isLoading}
                          className="flex-1"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Location
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {userLocation ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Current Location</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>City:</strong> {userLocation.city}</p>
                        <p><strong>Neighborhood:</strong> {userLocation.neighborhood}</p>
                        <p><strong>Address:</strong> {userLocation.address}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No location set</p>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowLocationForm(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {userLocation ? 'Update Location' : 'Set Location'}
                    </Button>
                    
                    {userLocation && (
                      <Button
                        onClick={handleClearLocation}
                        variant="destructive"
                        size="sm"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>About EYES</span>
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  EYES is a hyperlocal social platform that connects communities through 
                  real-time updates about what's happening in your neighborhood.
                </p>
                <p>
                  Share local events, report issues, and stay connected with your community.
                </p>
                <div className="pt-2">
                  <p><strong>Version:</strong> 1.0.0</p>
                  <p><strong>Features:</strong> Real-time posts, location-based feeds, categories, image uploads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

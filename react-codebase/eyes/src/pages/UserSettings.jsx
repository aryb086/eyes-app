import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { Eye, MapPin, User, Settings, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { toast } from 'react-hot-toast';

const UserSettings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { userLocation, setLocationFromAddress, clearLocation, validateAddress } = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [showLocationForm, setShowLocationForm] = useState(false);

  useEffect(() => {
    if (userLocation?.address) {
      setAddress(userLocation.address);
    }
  }, [userLocation]);

  const handleSetLocation = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    const validation = validateAddress(address);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      const result = await setLocationFromAddress(address);
      if (result.success) {
        toast.success('Location set successfully!');
        setShowLocationForm(false);
      } else {
        toast.error(result.error || 'Failed to set location');
      }
    } catch (error) {
      toast.error('Failed to set location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLocation = () => {
    clearLocation();
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
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={userName}
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
                <div>
                  <label className="block text-sm font-medium mb-2">Account Status</label>
                  <Input
                    value="Active"
                    disabled
                    className="bg-green-100 text-green-800"
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

          {/* Location Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Settings</span>
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLocation ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Current Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Address:</strong> {userLocation.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span><strong>City:</strong> {userLocation.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Neighborhood:</strong> {userLocation.neighborhood}</span>
                      </div>
                      {userLocation.coordinates && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Coordinates:</strong> {userLocation.coordinates.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowLocationForm(true)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Update Location
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearLocation}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Location
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No Location Set</h4>
                  <p className="text-muted-foreground mb-4">
                    Set your location to see posts from your area and create location-based posts.
                  </p>
                  <Button onClick={() => setShowLocationForm(true)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Set Location
                  </Button>
                </div>
              )}

              {/* Location Form */}
              {showLocationForm && (
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Set New Location</h4>
                  <form onSubmit={handleSetLocation} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Address *
                      </label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full address (e.g., 123 Main St, Seattle, WA)"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Include street number, street name, city, and state
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLocationForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || !address.trim()}
                      >
                        {isLoading ? 'Setting...' : 'Set Location'}
                      </Button>
                    </div>
                  </form>
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

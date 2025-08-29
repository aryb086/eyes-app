import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { Eye, MapPin, User, Settings, ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
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

  const handleAutoDetect = async () => {
    setIsLoading(true);
    try {
      const result = await setLocationFromAddress('auto-detect');
      if (result.success) {
        toast.success('Location auto-detected successfully!');
        setShowLocationForm(false);
      } else {
        toast.error(result.error || 'Failed to auto-detect location');
      }
    } catch (error) {
      toast.error('Failed to auto-detect location');
    } finally {
      setIsLoading(false);
    }
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
                      onClick={handleSetLocation}
                      disabled={isLoading || !address.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      Set Location
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleAutoDetect}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { Eye, MapPin, Search, Check, ArrowLeft, Loader2 } from 'lucide-react';
import locationService from '../services/locationService';

const LocationSetup = function() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState(null);
  const navigate = useNavigate();

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    setIsLoading(true);
    setError("");
    setDetectedLocation(null);

    try {
      const location = await locationService.geocodeAddress(address);
      setDetectedLocation(location);
      setStep(2);
    } catch (err) {
      setError("Could not find that address. Please try a different format.");
      console.error("Address detection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsLoading(true);
    setError("");
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
          coordinates: [position.coords.latitude, position.coords.longitude],
          address: 'Auto-detected from GPS'
        };

        setDetectedLocation(location);
        setStep(2);
      } else {
        throw new Error('Geolocation not supported by this browser');
      }
    } catch (err) {
      setError("Could not detect your location. Please enter your address manually.");
      console.error("Auto-detection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (detectedLocation) {
      localStorage.setItem("userLocation", JSON.stringify(detectedLocation));
      navigate("/feed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => navigate("/feed")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EYES</h1>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/feed")}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="w-full">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Set Your Location</h1>
            <p className="text-muted-foreground">
              Help us show you relevant content from your area
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  1
                </div>
                <div className={`w-16 h-1 rounded-full ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Step 1: Location Input */}
            {step === 1 && (
              <div className="space-y-6">
                <form onSubmit={handleAddressSubmit} className="space-y-4">
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
                      type="submit"
                      variant="default"
                      className="flex-1 flex items-center justify-center space-x-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Find Location</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutoDetect}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Auto-Detect</span>
                    </Button>
                  </div>
                </form>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Detecting your location...</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location Confirmation */}
            {step === 2 && detectedLocation && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Location Detected!</h2>
                  <p className="text-muted-foreground mb-6">
                    We found your location. Here's what we detected:
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                      <p className="text-sm font-medium">{detectedLocation.fullAddress}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="text-sm font-medium">{detectedLocation.city}</p>
                    </div>
                    {detectedLocation.neighborhood && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Neighborhood</label>
                        <p className="text-sm font-medium">{detectedLocation.neighborhood}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-sm font-medium">{detectedLocation.state}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Country</label>
                      <p className="text-sm font-medium">{detectedLocation.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Change Location
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleContinue}
                    className="flex-1"
                  >
                    Continue to Feed
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LocationSetup;

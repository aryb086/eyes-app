import React, { createContext, useContext, useState, useEffect } from 'react';
import locationService from '../services/locationService';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial location data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load user's saved location from localStorage
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        setUserLocation(parsedLocation);
        
        // Load cities and neighborhoods for the user's location
        if (parsedLocation.city) {
          await loadCities();
          if (parsedLocation.neighborhood) {
            await loadNeighborhoods(parsedLocation.city);
          }
        }
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      setError('Failed to load location data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load cities (this will be empty initially until users start registering)
  const loadCities = async () => {
    try {
      const response = await locationService.getCities();
      if (response.cities) {
        setCities(response.cities);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to load cities:', error);
      // Fallback: if backend doesn't have cities endpoint, use empty array
      setCities([]);
    }
  };

  // Load neighborhoods for a specific city
  const loadNeighborhoods = async (cityName) => {
    try {
      const response = await locationService.getNeighborhoods({ city: cityName });
      if (response.neighborhoods) {
        setNeighborhoods(response.neighborhoods);
      } else {
        setNeighborhoods([]);
      }
    } catch (error) {
      console.error('Failed to load neighborhoods:', error);
      // Fallback: if backend doesn't have neighborhoods endpoint, use empty array
      setNeighborhoods([]);
    }
  };

  // Set user location from address (creates city and neighborhood dynamically)
  const setLocationFromAddress = async (address) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, create a mock location since backend endpoints don't exist yet
      // This will be replaced with actual API calls when backend is ready
      const mockLocation = {
        city: 'Demo City',
        cityId: 'demo-city-1',
        neighborhood: 'Demo Neighborhood',
        neighborhoodId: 'demo-neighborhood-1',
        coordinates: [47.6062, -122.3321], // Seattle coordinates as example
        address: address
      };
      
      setUserLocation(mockLocation);
      localStorage.setItem('userLocation', JSON.stringify(mockLocation));
      
      // Refresh cities and neighborhoods
      await loadCities();
      await loadNeighborhoods(mockLocation.city);
      
      return { success: true, location: mockLocation };
      
      /* TODO: Uncomment when backend location endpoints are ready
      const locationData = await locationService.setLocationFromAddress(address);
      
      if (locationData.success) {
        const newLocation = {
          city: locationData.city,
          cityId: locationData.cityId,
          neighborhood: locationData.neighborhood,
          neighborhoodId: locationData.neighborhoodId,
          coordinates: locationData.coordinates,
          address: address
        };
        
        setUserLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        
        // Refresh cities and neighborhoods
        await loadCities();
        await loadNeighborhoods(newLocation.city);
        
        return { success: true, location: newLocation };
      } else {
        throw new Error(locationData.message || 'Failed to set location');
      }
      */
    } catch (error) {
      console.error('Error setting location from address:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Set location manually (for testing or admin purposes)
  const setLocationManually = (city, neighborhood, coordinates = null) => {
    const newLocation = {
      city,
      neighborhood,
      coordinates: coordinates || [0, 0]
    };
    
    setUserLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
    
    // Refresh cities and neighborhoods
    loadCities();
    loadNeighborhoods(city);
  };

  // Clear user location
  const clearLocation = () => {
    setUserLocation(null);
    setCities([]);
    setNeighborhoods([]);
    localStorage.removeItem('userLocation');
  };

  // Get nearby users
  const getNearbyUsers = async (radius = 5) => {
    try {
      const response = await locationService.getNearbyUsers(radius);
      return response;
    } catch (error) {
      console.error('Failed to get nearby users:', error);
      throw error;
    }
  };

  // Validate address format
  const validateAddress = (address) => {
    return locationService.validateAddress(address);
  };

  const hasLocation = () => {
    return userLocation !== null;
  };

  const getLocationDisplay = () => {
    if (!userLocation) {
      return 'No location set';
    }
    return `${userLocation.city}, ${userLocation.neighborhood}`;
  };

  return (
    <LocationContext.Provider
      value={{
        // State
        userLocation,
        cities,
        neighborhoods,
        isLoading,
        error,
        
        // Methods
        setLocationFromAddress,
        setLocationManually,
        clearLocation,
        getNearbyUsers,
        validateAddress,
        loadCities,
        loadNeighborhoods,
        hasLocation,
        getLocationDisplay,
        
        // Legacy compatibility (deprecated)
        getCurrentLocation: () => userLocation,
        saveUserLocation: () => userLocation ? true : false
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import locationService from '../services/locationService';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

  // Load initial location data
  useEffect(() => {
    loadInitialData();
  }, [currentUser]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user location from currentUser (backend) or localStorage (fallback)
      if (currentUser?.city && currentUser?.neighborhood) {
        const locationFromBackend = {
          city: currentUser.city,
          neighborhood: currentUser.neighborhood,
          address: currentUser.address,
          state: currentUser.stateCode,
          country: currentUser.country,
          zipCode: currentUser.zipCode,
          coordinates: currentUser.location?.coordinates || [0, 0]
        };
        setUserLocation(locationFromBackend);
      } else {
        // Fallback to localStorage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          const parsedLocation = JSON.parse(savedLocation);
          setUserLocation(parsedLocation);
        }
      }

      // Load demo cities and neighborhoods (skip backend API calls for now)
      await loadCities();
      await loadNeighborhoods();
    } catch (error) {
      console.error('Error loading location data:', error);
      setError('Failed to load location data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load cities from backend
  const loadCities = async () => {
    try {
      const response = await locationService.getCities();
      if (response.data) {
        setCities(response.data.map(city => city.name));
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to load cities:', error);
      // Fallback: provide demo cities to prevent UI errors
      setCities(['Seattle', 'Demo City']);
    }
  };

  // Load neighborhoods from backend
  const loadNeighborhoods = async (cityName = null) => {
    try {
      if (!cityName) {
        setNeighborhoods([]);
        return;
      }
      
      const response = await locationService.getNeighborhoods(cityName);
      if (response.data) {
        setNeighborhoods(response.data.map(neighborhood => neighborhood.name));
      } else {
        setNeighborhoods([]);
      }
    } catch (error) {
      console.error('Failed to load neighborhoods:', error);
      // Fallback: provide demo neighborhoods to prevent UI errors
      setNeighborhoods(['Capitol Hill', 'Downtown Seattle', 'Demo Neighborhood']);
    }
  };

  // Set user location from address (creates city and neighborhood dynamically)
  const setLocationFromAddress = async (address) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, create a mock location since backend endpoints don't exist yet
      // This will be replaced with actual API calls when backend is ready
      console.log('Creating mock location - backend endpoints not ready yet');
      
      // Simulate geocoding by parsing the address
      let detectedCity = 'Demo City';
      let detectedNeighborhood = 'Demo Neighborhood';
      
      // Basic address parsing (this would be replaced with real geocoding)
      if (address.toLowerCase().includes('seattle')) {
        detectedCity = 'Seattle';
        if (address.toLowerCase().includes('capitol hill')) {
          detectedNeighborhood = 'Capitol Hill';
        } else if (address.toLowerCase().includes('downtown')) {
          detectedNeighborhood = 'Downtown Seattle';
        } else {
          detectedNeighborhood = 'Seattle Neighborhood';
        }
      } else if (address.toLowerCase().includes('new york')) {
        detectedCity = 'New York';
        detectedNeighborhood = 'NYC Neighborhood';
      } else if (address.toLowerCase().includes('los angeles')) {
        detectedCity = 'Los Angeles';
        detectedNeighborhood = 'LA Neighborhood';
      } else if (address.toLowerCase().includes('chicago')) {
        detectedCity = 'Chicago';
        detectedNeighborhood = 'Chicago Neighborhood';
      }
      
      const mockLocation = {
        city: detectedCity,
        cityId: `${detectedCity.toLowerCase().replace(/\s+/g, '-')}-1`,
        neighborhood: detectedNeighborhood,
        neighborhoodId: `${detectedNeighborhood.toLowerCase().replace(/\s+/g, '-')}-1`,
        coordinates: [47.6062, -122.3321], // Seattle coordinates as example
        address: address
      };
      
      setUserLocation(mockLocation);
      localStorage.setItem('userLocation', JSON.stringify(mockLocation));
      
      // Add detected city and neighborhood to arrays if they don't exist
      if (!cities.includes(detectedCity)) {
        setCities(prev => [...prev, detectedCity]);
      }
      if (!neighborhoods.includes(detectedNeighborhood)) {
        setNeighborhoods(prev => [...prev, detectedNeighborhood]);
      }
      
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

  // Get nearby users (placeholder until backend is ready)
  const getNearbyUsers = async (radius = 5) => {
    try {
      // For now, return empty array since backend endpoint doesn't exist
      console.log('getNearbyUsers not implemented yet - backend endpoint not ready');
      return { users: [] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const response = await locationService.getNearbyUsers(radius);
      return response;
      */
    } catch (error) {
      console.error('Failed to get nearby users:', error);
      throw error;
    }
  };

  // Validate address format (basic validation)
  const validateAddress = (address) => {
    if (!address || typeof address !== 'string') {
      return { valid: false, error: 'Address must be a non-empty string' };
    }

    if (address.length < 10) {
      return { valid: false, error: 'Address must be at least 10 characters long' };
    }

    // Basic validation - address should contain street number and name
    const hasStreetNumber = /\d/.test(address);
    const hasStreetName = /[a-zA-Z]/.test(address);

    if (!hasStreetNumber || !hasStreetName) {
      return { valid: false, error: 'Address must include street number and street name' };
    }

    return { valid: true };
  };

  // Check if user has location set
  const hasLocation = () => {
    return userLocation !== null;
  };

  // Get location display string
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

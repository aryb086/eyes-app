import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getStates, 
  getCitiesByState, 
  getNeighborhoods,
  getUserLocation,
  saveUserLocation as saveLocation
} from '../services/locationService';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [stateCode, setStateCode] = useState('');
  const [cityId, setCityId] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial location data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load states
        const statesData = getStates();
        setStates(statesData);
        
        // Load user's saved location or use default
        const userLocation = getUserLocation();
        setStateCode(userLocation.stateCode);
        
        // Load cities for the user's state
        const citiesData = getCitiesByState(userLocation.stateCode);
        setCities(citiesData);
        
        // Set city and load neighborhoods
        if (userLocation.cityId) {
          setCityId(userLocation.cityId);
          const neighborhoodsData = getNeighborhoods(
            userLocation.stateCode, 
            userLocation.cityId
          );
          setNeighborhoods(neighborhoodsData);
          
          // Set neighborhood if available
          if (userLocation.neighborhood) {
            setNeighborhood(userLocation.neighborhood);
          }
        }
      } catch (error) {
        console.error('Error loading location data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Update cities when state changes
  const handleStateChange = (newStateCode) => {
    setStateCode(newStateCode);
    const newCities = getCitiesByState(newStateCode);
    setCities(newCities);
    
    // Reset city and neighborhood when state changes
    setCityId('');
    setNeighborhood('');
    setNeighborhoods([]);
  };

  // Update neighborhoods when city changes
  const handleCityChange = (newCityId) => {
    setCityId(newCityId);
    const newNeighborhoods = getNeighborhoods(stateCode, newCityId);
    setNeighborhoods(newNeighborhoods);
    
    // Reset neighborhood when city changes
    setNeighborhood('');
  };

  // Save the current location
  const saveUserLocation = () => {
    if (stateCode && cityId) {
      const location = { stateCode, cityId };
      if (neighborhood) {
        location.neighborhood = neighborhood;
      }
      saveLocation(location);
      return true;
    }
    return false;
  };

  return (
    <LocationContext.Provider
      value={{
        stateCode,
        cityId,
        neighborhood,
        states,
        cities,
        neighborhoods,
        isLoading,
        setStateCode: handleStateChange,
        setCityId: handleCityChange,
        setNeighborhood,
        saveUserLocation,
        getCurrentLocation: () => ({ stateCode, cityId, neighborhood })
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

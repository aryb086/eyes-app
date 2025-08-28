import React, { createContext, useState, useEffect, useContext } from 'react';
import locationService from '../services/locationService';

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
        const statesData = [
          { code: 'WA', name: 'Washington' },
          { code: 'CA', name: 'California' },
          { code: 'NY', name: 'New York' },
          { code: 'TX', name: 'Texas' },
          { code: 'IL', name: 'Illinois' }
        ];
        setStates(statesData);
        
        // Load user's saved location or use default
        const userLocation = localStorage.getItem('userLocation') ? 
          JSON.parse(localStorage.getItem('userLocation')) : 
          { stateCode: 'WA', cityId: 'seattle' };
        setStateCode(userLocation.stateCode);
        
        // Load cities for the user's state
        const citiesData = locationService.getCities().map(cityName => ({
          id: cityName.toLowerCase().replace(/\s+/g, '-'),
          name: cityName
        }));
        setCities(citiesData);
        
        // Set city and load neighborhoods
        if (userLocation.cityId) {
          setCityId(userLocation.cityId);
          const neighborhoodsData = locationService.getNeighborhoods(
            userLocation.cityId === 'seattle' ? 'Seattle' : 'Seattle'
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
    const newCities = locationService.getCities().map(cityName => ({
      id: cityName.toLowerCase().replace(/\s+/g, '-'),
      name: cityName
    }));
    setCities(newCities);
    
    // Reset city and neighborhood when state changes
    setCityId('');
    setNeighborhood('');
    setNeighborhoods([]);
  };

  // Update neighborhoods when city changes
  const handleCityChange = (newCityId) => {
    setCityId(newCityId);
    const cityName = cities.find(c => c.id === newCityId)?.name || 'Seattle';
    const newNeighborhoods = locationService.getNeighborhoods(cityName);
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
      localStorage.setItem('userLocation', JSON.stringify(location));
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

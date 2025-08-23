import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { getCitiesByState } from '../services/locationService';
import Feed from '../components/feed/Feed';
// No custom styles; reuse Feed styles for visual parity with Neighborhood Feed

const CityFeed = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { stateCode, getCurrentLocation } = useLocation();
  const [city, setCity] = useState(null);
  // CityFeed should visually match Neighborhood feed; all header/controls handled by Feed
  
  // Load city data when component mounts or cityId changes
  useEffect(() => {
    const loadCityData = () => {
      try {
        if (!cityId) return;
        
        // In a real app, you would fetch city data from an API
        // For now, we'll use the locationService
        const cities = getCitiesByState(stateCode);
        const currentCity = cities.find(city => city.id === cityId);
        
        if (currentCity) {
          setCity({
            id: currentCity.id,
            name: currentCity.name,
            stateCode
          });
        } else {
          // If city not found, redirect to home or show error
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading city data:', error);
        navigate('/');
      }
    };
    
    loadCityData();
  }, [cityId, stateCode, navigate]);
  
  // Get posts for this city (in a real app, this would be an API call)
  // All location selection is deferred for future; keep route as source of truth
  
  if (!city) {
    return <div>Loading city data...</div>;
  }
  
  return (
    <Feed 
      user={getCurrentLocation()} 
      onLogout={() => {}} 
      isCityFeed={true}
      cityId={cityId}
    />
  );
}
;

export default CityFeed;

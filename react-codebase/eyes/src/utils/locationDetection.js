// Real geocoding utility for parsing addresses and detecting cities/neighborhoods
// Uses backend API endpoints that communicate with Google Maps API

import api, { ENDPOINTS } from '../services/api';

// Fallback location data for development/testing when API key is not available
const FALLBACK_LOCATIONS = {
  'seattle': {
    name: 'Seattle',
    state: 'WA',
    coordinates: [-122.3321, 47.6062],
    neighborhoods: ['Capitol Hill', 'Downtown', 'Ballard', 'Fremont', 'Queen Anne', 'Belltown']
  },
  'new york': {
    name: 'New York',
    state: 'NY',
    coordinates: [-74.0060, 40.7128],
    neighborhoods: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Times Square']
  },
  'los angeles': {
    name: 'Los Angeles',
    state: 'CA',
    coordinates: [-118.2437, 34.0522],
    neighborhoods: ['Downtown', 'Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'West Hollywood']
  },
  'chicago': {
    name: 'Chicago',
    state: 'IL',
    coordinates: [-87.6298, 41.8781],
    neighborhoods: ['The Loop', 'River North', 'Gold Coast', 'Lincoln Park', 'Lakeview', 'West Loop']
  }
};



/**
 * Fallback geocoding using simple text matching
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
const fallbackGeocodeAddress = async (address) => {
  const addressLower = address.toLowerCase();
  
  for (const [cityKey, cityData] of Object.entries(FALLBACK_LOCATIONS)) {
    if (addressLower.includes(cityKey)) {
      return {
        lat: cityData.coordinates[1],
        lng: cityData.coordinates[0],
        formatted_address: `${cityData.name}, ${cityData.state}`,
        place_id: `fallback_${cityKey}`
      };
    }
  }
  
  // Default to Seattle if no match found
  return {
    lat: 47.6062,
    lng: -122.3321,
    formatted_address: 'Seattle, WA',
    place_id: 'fallback_seattle'
  };
};

/**
 * Fallback reverse geocoding
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{city: string, neighborhood: string, state: string, country: string, formatted_address: string}>}
 */
const fallbackReverseGeocode = async (lat, lng) => {
  // Find the closest city from our fallback data
  let closestCity = null;
  let minDistance = Infinity;
  
  for (const [cityKey, cityData] of Object.entries(FALLBACK_LOCATIONS)) {
    const distance = Math.sqrt(
      Math.pow(lat - cityData.coordinates[1], 2) + 
      Math.pow(lng - cityData.coordinates[0], 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = { key: cityKey, ...cityData };
    }
  }
  
  if (closestCity) {
    return {
      city: closestCity.name,
      neighborhood: closestCity.neighborhoods[0],
      state: closestCity.state,
      country: 'USA',
      postal_code: '00000',
      formatted_address: `${closestCity.name}, ${closestCity.state}`,
      place_id: `fallback_${closestCity.key}`
    };
  }
  
  // Default fallback
  return {
    city: 'Seattle',
    neighborhood: 'Capitol Hill',
    state: 'WA',
    country: 'USA',
    postal_code: '98102',
    formatted_address: 'Seattle, WA',
    place_id: 'fallback_seattle'
  };
};

/**
 * Convert address to coordinates using backend geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
export const geocodeAddress = async (address) => {
  try {
    console.log('🌍 Geocoding address via backend:', address);
    
    const response = await api.post('/location/geocode', { address });
    
    if (response.success && response.data) {
      console.log('✅ Backend geocoding successful:', response.data);
      return response.data;
    }
    
    throw new Error('Backend geocoding failed');
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to simple geocoding if backend fails
    return await fallbackGeocodeAddress(address);
  }
};

/**
 * Convert coordinates to address using backend reverse geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{city: string, neighborhood: string, state: string, country: string, formatted_address: string}>}
 */
export const reverseGeocodeCoordinates = async (lat, lng) => {
  try {
    console.log('🌍 Reverse geocoding coordinates via backend:', { lat, lng });
    
    const response = await api.post('/location/reverse-geocode', { lat, lng });
    
    if (response.success && response.data) {
      console.log('✅ Backend reverse geocoding successful:', response.data);
      return response.data;
    }
    
    throw new Error('Backend reverse geocoding failed');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to simple reverse geocoding if backend fails
    return await fallbackReverseGeocode(lat, lng);
  }
};

/**
 * Detect location from address string
 * @param {string} address - The address to parse
 * @returns {Promise<{city: string, neighborhood: string, coordinates: [number, number], formatted_address: string}>}
 */
export const detectLocationFromAddress = async (address) => {
  try {
    // First, geocode the address to get coordinates
    const geocodeResult = await geocodeAddress(address);
    
    // Then, reverse geocode to get detailed location information
    const reverseResult = await reverseGeocodeCoordinates(geocodeResult.lat, geocodeResult.lng);
    
    return {
      city: reverseResult.city,
      neighborhood: reverseResult.neighborhood,
      state: reverseResult.state,
      country: reverseResult.country,
      postal_code: reverseResult.postal_code,
      coordinates: [geocodeResult.lng, geocodeResult.lat], // GeoJSON format: [longitude, latitude]
      address: reverseResult.formatted_address, // Add address field for UI compatibility
      formatted_address: reverseResult.formatted_address,
      place_id: reverseResult.place_id
    };
  } catch (error) {
    console.error('Location detection error:', error);
    throw error;
  }
};

/**
 * Get nearby neighborhoods using backend API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array<{name: string, place_id: string, distance: number}>>}
 */
export const getNearbyNeighborhoods = async (lat, lng, radius = 5000) => {
  try {
    console.log('🌍 Getting nearby neighborhoods via backend:', { lat, lng, radius });
    
    const response = await api.post('/location/nearby-neighborhoods', { lat, lng, radius });
    
    if (response.success && response.data) {
      console.log('✅ Backend nearby neighborhoods successful:', response.data.length, 'neighborhoods found');
      return response.data;
    }
    
    throw new Error('Backend nearby neighborhoods failed');
  } catch (error) {
    console.error('Nearby neighborhoods error:', error);
    // Fallback to simple neighborhoods if backend fails
    return getFallbackNeighborhoods(lat, lng);
  }
};

/**
 * Get fallback neighborhoods based on location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Array<{name: string, place_id: string, distance: number}>}
 */
const getFallbackNeighborhoods = (lat, lng) => {
  // Find the closest city and return its neighborhoods
  let closestCity = null;
  let minDistance = Infinity;
  
  for (const [cityKey, cityData] of Object.entries(FALLBACK_LOCATIONS)) {
    const distance = Math.sqrt(
      Math.pow(lat - cityData.coordinates[1], 2) + 
      Math.pow(lng - cityData.coordinates[0], 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = { key: cityKey, ...cityData };
    }
  }
  
  if (closestCity) {
    return closestCity.neighborhoods.map((name, index) => ({
      name,
      place_id: `fallback_${closestCity.key}_${index}`,
      distance: Math.round((index + 1) * 1000), // Simulate distance
      coordinates: closestCity.coordinates
    }));
  }
  
  // Default fallback
  return [
    { name: 'Capitol Hill', place_id: 'fallback_default_1', distance: 1000, coordinates: [-122.3321, 47.6062] },
    { name: 'Downtown', place_id: 'fallback_default_2', distance: 2000, coordinates: [-122.3321, 47.6062] },
    { name: 'Ballard', place_id: 'fallback_default_3', distance: 3000, coordinates: [-122.3321, 47.6062] }
  ];
};

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Auto-detect user's current location using browser geolocation
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
export const autoDetectLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode the coordinates to get address
          const locationInfo = await reverseGeocodeCoordinates(latitude, longitude);
          
          resolve({
            lat: latitude,
            lng: longitude,
            coordinates: [longitude, latitude],
            address: locationInfo.formatted_address, // Add address field for UI compatibility
            ...locationInfo
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Validate and format address for geocoding
 * @param {string} address - Raw address input
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a non-empty string');
  }

  // Remove extra whitespace and normalize
  return address.trim().replace(/\s+/g, ' ');
};

/**
 * Create a unique location identifier
 * @param {string} city - City name
 * @param {string} neighborhood - Neighborhood name
 * @returns {string} Unique location ID
 */
export const createLocationId = (city, neighborhood) => {
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${neighborhood.toLowerCase().replace(/\s+/g, '-')}`;
};

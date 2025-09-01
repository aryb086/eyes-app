// Real geocoding utility for parsing addresses and detecting cities/neighborhoods
// Uses Google Maps Geocoding API for accurate location detection

// Google Maps API Key - you'll need to add this to your environment variables
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Geocoding API endpoints
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const REVERSE_GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

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
 * Check if Google Maps API is available
 * @returns {boolean}
 */
const isGoogleMapsAvailable = () => {
  return !!GOOGLE_MAPS_API_KEY;
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
 * Convert address to coordinates using Google Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formatted_address: string}>}
 */
export const geocodeAddress = async (address) => {
  try {
    if (!isGoogleMapsAvailable()) {
      console.warn('Google Maps API key not available, using fallback geocoding');
      return await fallbackGeocodeAddress(address);
    }

    const response = await fetch(
      `${GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results found'}`);
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;
    const formattedAddress = result.formatted_address;

    return {
      lat,
      lng,
      formatted_address: formattedAddress,
      place_id: result.place_id
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to simple geocoding if API fails
    return await fallbackGeocodeAddress(address);
  }
};

/**
 * Convert coordinates to address using Google Reverse Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{city: string, neighborhood: string, state: string, country: string, formatted_address: string}>}
 */
export const reverseGeocodeCoordinates = async (lat, lng) => {
  try {
    if (!isGoogleMapsAvailable()) {
      console.warn('Google Maps API key not available, using fallback reverse geocoding');
      return await fallbackReverseGeocode(lat, lng);
    }

    const response = await fetch(
      `${REVERSE_GEOCODING_API_URL}?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Reverse geocoding failed: ${data.status} - ${data.error_message || 'No results found'}`);
    }

    const result = data.results[0];
    const addressComponents = result.address_components;

    // Extract location information from address components
    let city = '';
    let neighborhood = '';
    let state = '';
    let country = '';
    let postalCode = '';

    for (const component of addressComponents) {
      const types = component.types;

      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      } else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        neighborhood = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }

    // If no neighborhood found, try to extract from formatted address
    if (!neighborhood && result.formatted_address) {
      const parts = result.formatted_address.split(',');
      if (parts.length > 1) {
        neighborhood = parts[0].trim();
      }
    }

    return {
      city,
      neighborhood,
      state,
      country,
      postal_code: postalCode,
      formatted_address: result.formatted_address,
      place_id: result.place_id
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Fallback to simple reverse geocoding if API fails
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
      formatted_address: reverseResult.formatted_address,
      place_id: reverseResult.place_id
    };
  } catch (error) {
    console.error('Location detection error:', error);
    throw error;
  }
};

/**
 * Get nearby neighborhoods using Google Places API or fallback
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @returns {Promise<Array<{name: string, place_id: string, distance: number}>>}
 */
export const getNearbyNeighborhoods = async (lat, lng, radius = 5000) => {
  try {
    if (!isGoogleMapsAvailable()) {
      console.warn('Google Maps API key not available, using fallback neighborhoods');
      return getFallbackNeighborhoods(lat, lng);
    }

    // Use Places API to find nearby neighborhoods
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=sublocality&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!placesResponse.ok) {
      throw new Error(`Places API request failed: ${placesResponse.status}`);
    }

    const placesData = await placesResponse.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API failed: ${placesData.status} - ${placesData.error_message || 'Request failed'}`);
    }

    const neighborhoods = [];

    if (placesData.results && placesData.results.length > 0) {
      for (const place of placesData.results) {
        // Calculate distance from original location
        const distance = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
        
        neighborhoods.push({
          name: place.name,
          place_id: place.place_id,
          distance: Math.round(distance),
          coordinates: [place.geometry.location.lng, place.geometry.location.lat]
        });
      }

      // Sort by distance
      neighborhoods.sort((a, b) => a.distance - b.distance);
    }

    return neighborhoods;
  } catch (error) {
    console.error('Nearby neighborhoods error:', error);
    // Fallback to simple neighborhoods if API fails
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

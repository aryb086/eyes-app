const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Fallback location data for development/testing
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

// @desc    Geocode address to coordinates
// @route   POST /api/v1/location/geocode
// @access  Public
exports.geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return next(new ErrorResponse('Address is required', 400));
    }

    console.log('🌍 Geocoding address:', address);

    // Try Google Maps API if available
    if (GOOGLE_MAPS_API_KEY) {
      try {
        const response = await axios.get(GEOCODING_API_URL, {
          params: {
            address: address,
            key: GOOGLE_MAPS_API_KEY
          }
        });

        const data = response.data;

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          const { lat, lng } = result.geometry.location;

          console.log('✅ Google Maps geocoding successful:', { lat, lng });

          return res.status(200).json({
            success: true,
            data: {
              lat,
              lng,
              formatted_address: result.formatted_address,
              place_id: result.place_id
            }
          });
        }
      } catch (error) {
        console.warn('Google Maps geocoding failed, using fallback:', error.message);
      }
    }

    // Fallback geocoding
    const fallbackResult = await fallbackGeocode(address);
    console.log('🔄 Using fallback geocoding:', fallbackResult);

    res.status(200).json({
      success: true,
      data: fallbackResult
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    next(error);
  }
};

// @desc    Reverse geocode coordinates to address
// @route   POST /api/v1/location/reverse-geocode
// @access  Public
exports.reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return next(new ErrorResponse('Latitude and longitude are required', 400));
    }

    console.log('🌍 Reverse geocoding coordinates:', { lat, lng });

    // Try Google Maps API if available
    if (GOOGLE_MAPS_API_KEY) {
      try {
        const response = await axios.get(GEOCODING_API_URL, {
          params: {
            latlng: `${lat},${lng}`,
            key: GOOGLE_MAPS_API_KEY
          }
        });

        const data = response.data;

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          const addressComponents = result.address_components;

          // Extract location information from address components
          let city = '';
          let neighborhood = '';
          let state = '';
          let country = '';
          let postalCode = '';

          // First pass: extract basic components
          for (const component of addressComponents) {
            const types = component.types;

            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          }

          // Second pass: find neighborhood with better logic
          // Priority order for neighborhood detection (most specific first)
          const neighborhoodTypes = [
            'sublocality_level_1',  // Most specific neighborhood
            'sublocality_level_2', 
            'sublocality',
            'neighborhood',
            'political'
          ];

          // Look for neighborhood components
          for (const neighborhoodType of neighborhoodTypes) {
            for (const component of addressComponents) {
              if (component.types.includes(neighborhoodType)) {
                // Make sure it's not the same as the city
                if (component.long_name !== city) {
                  neighborhood = component.long_name;
                  break;
                }
              }
            }
            if (neighborhood) break;
          }

          // If no neighborhood found, try to extract from formatted address
          if (!neighborhood && result.formatted_address) {
            const parts = result.formatted_address.split(',');
            if (parts.length > 1) {
              // Look for neighborhood-like names in the address
              for (const part of parts) {
                const trimmed = part.trim();
                // Skip if it looks like a street address, city, or state
                if (!trimmed.match(/^\d+/) && 
                    !trimmed.includes('St') && 
                    !trimmed.includes('Ave') && 
                    !trimmed.includes('Rd') && 
                    !trimmed.includes('Blvd') && 
                    !trimmed.includes('WA') &&
                    !trimmed.includes('USA') &&
                    trimmed !== city &&
                    trimmed.length > 3) {
                  neighborhood = trimmed;
                  break;
                }
              }
            }
          }

          // Special case: if we still don't have a neighborhood, try to use the street name
          // as a neighborhood indicator (common in suburban areas)
          if (!neighborhood && result.formatted_address) {
            const addressParts = result.formatted_address.split(',')[0].trim();
            const streetParts = addressParts.split(' ');
            if (streetParts.length > 2) {
              // Look for neighborhood-like words in the street address
              for (let i = 1; i < streetParts.length; i++) {
                const word = streetParts[i];
                if (word.length > 3 && 
                    !word.match(/^\d+/) && 
                    !['St', 'Ave', 'Rd', 'Blvd', 'Dr', 'Ln', 'Way', 'Pl', 'Ct'].includes(word)) {
                  neighborhood = word;
                  break;
                }
              }
            }
          }

          console.log('✅ Google Maps reverse geocoding successful:', { city, neighborhood, state });

          return res.status(200).json({
            success: true,
            data: {
              city,
              neighborhood,
              state,
              country,
              postal_code: postalCode,
              formatted_address: result.formatted_address,
              place_id: result.place_id
            }
          });
        }
      } catch (error) {
        console.warn('Google Maps reverse geocoding failed, using fallback:', error.message);
      }
    }

    // Fallback reverse geocoding
    const fallbackResult = await fallbackReverseGeocode(lat, lng);
    console.log('🔄 Using fallback reverse geocoding:', fallbackResult);

    res.status(200).json({
      success: true,
      data: fallbackResult
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    next(error);
  }
};

// @desc    Get nearby neighborhoods
// @route   POST /api/v1/location/nearby-neighborhoods
// @access  Public
exports.getNearbyNeighborhoods = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;

    if (!lat || !lng) {
      return next(new ErrorResponse('Latitude and longitude are required', 400));
    }

    console.log('🌍 Getting nearby neighborhoods:', { lat, lng, radius });

    // Try Google Places API if available
    if (GOOGLE_MAPS_API_KEY) {
      try {
        // Strategy 1: Search for neighborhoods using multiple place types
        const searchStrategies = [
          { type: 'sublocality', name: 'sublocality' },
          { type: 'sublocality_level_1', name: 'sublocality_level_1' },
          { type: 'sublocality_level_2', name: 'sublocality_level_2' },
          { type: 'neighborhood', name: 'neighborhood' },
          { type: 'political', name: 'political' }
        ];

        let allNeighborhoods = new Map(); // Use Map to avoid duplicates

        // Try each search strategy
        for (const strategy of searchStrategies) {
          try {
            const response = await axios.get(PLACES_API_URL, {
              params: {
                location: `${lat},${lng}`,
                radius: radius,
                type: strategy.type,
                key: GOOGLE_MAPS_API_KEY
              }
            });

            const data = response.data;

            if (data.status === 'OK' && data.results && data.results.length > 0) {
              data.results.forEach((place) => {
                const distance = calculateDistance(
                  lat, lng, 
                  place.geometry.location.lat, 
                  place.geometry.location.lng
                );

                // Use place_id as unique key to avoid duplicates
                const key = place.place_id;
                if (!allNeighborhoods.has(key)) {
                  allNeighborhoods.set(key, {
                    name: place.name,
                    place_id: place.place_id,
                    distance: Math.round(distance),
                    coordinates: [place.geometry.location.lng, place.geometry.location.lat],
                    types: place.types || []
                  });
                }
              });
            }
          } catch (strategyError) {
            console.warn(`Strategy ${strategy.name} failed:`, strategyError.message);
          }
        }

        // Strategy 2: Use Text Search for neighborhoods and specific area names
        const textSearchQueries = [
          'neighborhood',
          'subdivision',
          'community',
          'area',
          'district',
          'HOA',
          'homeowners association',
          'ridge',
          'heights',
          'hills',
          'village',
          'estates'
        ];

        for (const query of textSearchQueries) {
          try {
            const textSearchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
              params: {
                query: query,
                location: `${lat},${lng}`,
                radius: radius,
                key: GOOGLE_MAPS_API_KEY
              }
            });

            const textData = textSearchResponse.data;
            if (textData.status === 'OK' && textData.results && textData.results.length > 0) {
              textData.results.forEach((place) => {
                const distance = calculateDistance(
                  lat, lng, 
                  place.geometry.location.lat, 
                  place.geometry.location.lng
                );

                const key = place.place_id;
                if (!allNeighborhoods.has(key)) {
                  allNeighborhoods.set(key, {
                    name: place.name,
                    place_id: place.place_id,
                    distance: Math.round(distance),
                    coordinates: [place.geometry.location.lng, place.geometry.location.lat],
                    types: place.types || []
                  });
                }
              });
            }
          } catch (textSearchError) {
            console.warn(`Text search for "${query}" failed:`, textSearchError.message);
          }
        }

        // Strategy 3: Search for specific known neighborhood names in the area
        // This helps catch neighborhoods that might not be tagged properly
        const knownNeighborhoodSearches = [
          'Timberline',
          'Sahalee', 
          'Viewpoint',
          'Cascade View',
          'Montrachet'
        ];

        for (const searchTerm of knownNeighborhoodSearches) {
          try {
            const specificSearchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
              params: {
                query: `${searchTerm} Sammamish WA`,
                location: `${lat},${lng}`,
                radius: radius,
                key: GOOGLE_MAPS_API_KEY
              }
            });

            const specificData = specificSearchResponse.data;
            if (specificData.status === 'OK' && specificData.results && specificData.results.length > 0) {
              specificData.results.forEach((place) => {
                const distance = calculateDistance(
                  lat, lng, 
                  place.geometry.location.lat, 
                  place.geometry.location.lng
                );

                const key = place.place_id;
                if (!allNeighborhoods.has(key)) {
                  allNeighborhoods.set(key, {
                    name: place.name,
                    place_id: place.place_id,
                    distance: Math.round(distance),
                    coordinates: [place.geometry.location.lng, place.geometry.location.lat],
                    types: place.types || []
                  });
                }
              });
            }
          } catch (specificSearchError) {
            console.warn(`Specific search for "${searchTerm}" failed:`, specificSearchError.message);
          }
        }

        // Convert Map to Array and sort by distance
        const neighborhoods = Array.from(allNeighborhoods.values());
        neighborhoods.sort((a, b) => a.distance - b.distance);

        // Limit to top 10 results
        const topNeighborhoods = neighborhoods.slice(0, 10);

        if (topNeighborhoods.length > 0) {
          console.log('✅ Google Places API successful:', topNeighborhoods.length, 'neighborhoods found');
          return res.status(200).json({
            success: true,
            data: topNeighborhoods
          });
        }
      } catch (error) {
        console.warn('Google Places API failed, using fallback:', error.message);
      }
    }

    // Fallback neighborhoods
    const fallbackResult = getFallbackNeighborhoods(lat, lng);
    console.log('🔄 Using fallback neighborhoods:', fallbackResult.length, 'neighborhoods');

    res.status(200).json({
      success: true,
      data: fallbackResult
    });
  } catch (error) {
    console.error('Nearby neighborhoods error:', error);
    next(error);
  }
};

// @desc    Get cities
// @route   GET /api/v1/location/cities
// @access  Public
exports.getCities = async (req, res, next) => {
  try {
    const cities = Object.values(FALLBACK_LOCATIONS).map(city => ({
      name: city.name,
      state: city.state,
      coordinates: city.coordinates
    }));

    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Get cities error:', error);
    next(error);
  }
};

// @desc    Get neighborhoods by city
// @route   GET /api/v1/location/neighborhoods
// @access  Public
exports.getNeighborhoods = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return next(new ErrorResponse('City is required', 400));
    }

    const cityKey = city.toLowerCase();
    const cityData = FALLBACK_LOCATIONS[cityKey];

    if (!cityData) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const neighborhoods = cityData.neighborhoods.map((name, index) => ({
      id: `${cityKey}_${index}`,
      name,
      city: cityData.name,
      state: cityData.state,
      coordinates: cityData.coordinates
    }));

    res.status(200).json({
      success: true,
      data: neighborhoods
    });
  } catch (error) {
    console.error('Get neighborhoods error:', error);
    next(error);
  }
};

// Helper functions
const fallbackGeocode = async (address) => {
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
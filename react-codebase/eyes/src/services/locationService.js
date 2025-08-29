import api, { ENDPOINTS } from './api';

class LocationService {
  // Geocode an address to get coordinates and location data
  async geocodeAddress(address) {
    try {
      const response = await api.post(ENDPOINTS.LOCATION.GEOCODE, { address });
      return response;
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates to get address and location data
  async reverseGeocode(lat, lng) {
    try {
      const response = await api.post(ENDPOINTS.LOCATION.REVERSE_GEOCODE, { lat, lng });
      return response;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  // Get or create city from address
  async getOrCreateCity(address) {
    try {
      // First try to geocode the address
      const geocodeResult = await this.geocodeAddress(address);
      
      if (geocodeResult.city) {
        // Check if city exists in our system
        const cityResponse = await api.get(`${ENDPOINTS.LOCATION.CITIES}?name=${encodeURIComponent(geocodeResult.city)}`);
        
        if (cityResponse.cities && cityResponse.cities.length > 0) {
          return cityResponse.cities[0];
        } else {
          // Create new city if it doesn't exist
          const newCity = await api.post(ENDPOINTS.LOCATION.CITIES, {
            name: geocodeResult.city,
            state: geocodeResult.state,
            country: geocodeResult.country,
            coordinates: geocodeResult.coordinates
          });
          return newCity;
        }
      }
      
      throw new Error('Could not determine city from address');
    } catch (error) {
      console.error('Get or create city failed:', error);
      throw error;
    }
  }

  // Get or create neighborhood from address
  async getOrCreateNeighborhood(address, cityId) {
    try {
      // Geocode the address to get neighborhood info
      const geocodeResult = await this.geocodeAddress(address);
      
      if (geocodeResult.neighborhood || geocodeResult.suburb) {
        const neighborhoodName = geocodeResult.neighborhood || geocodeResult.suburb;
        
        // Check if neighborhood exists in our system
        const neighborhoodResponse = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?name=${encodeURIComponent(neighborhoodName)}&cityId=${cityId}`);
        
        if (neighborhoodResponse.neighborhoods && neighborhoodResponse.neighborhoods.length > 0) {
          return neighborhoodResponse.neighborhoods[0];
        } else {
          // Create new neighborhood if it doesn't exist
          const newNeighborhood = await api.post(ENDPOINTS.LOCATION.NEIGHBORHOODS, {
            name: neighborhoodName,
            cityId: cityId,
            coordinates: geocodeResult.coordinates,
            bounds: geocodeResult.bounds
          });
          return newNeighborhood;
        }
      }
      
      throw new Error('Could not determine neighborhood from address');
    } catch (error) {
      console.error('Get or create neighborhood failed:', error);
      throw error;
    }
  }

  // Set user location from address
  async setLocationFromAddress(address) {
    try {
      // Get or create city first
      const city = await this.getOrCreateCity(address);
      
      // Get or create neighborhood
      const neighborhood = await this.getOrCreateNeighborhood(address, city._id);
      
      // Set user location
      const locationData = {
        city: city.name,
        cityId: city._id,
        neighborhood: neighborhood.name,
        neighborhoodId: neighborhood._id,
        coordinates: neighborhood.coordinates,
        address: address
      };
      
      const response = await api.post(ENDPOINTS.USERS.LOCATION, locationData);
      return response;
    } catch (error) {
      console.error('Set location from address failed:', error);
      throw error;
    }
  }

  // Get nearby users
  async getNearbyUsers(radius = 5) {
    try {
      const response = await api.get(`${ENDPOINTS.USERS.NEARBY}?radius=${radius}`);
      return response;
    } catch (error) {
      console.error('Get nearby users failed:', error);
      throw error;
    }
  }

  // Get cities (with optional filtering)
  async getCities(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.CITIES}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get cities failed:', error);
      throw error;
    }
  }

  // Get neighborhoods (with optional filtering)
  async getNeighborhoods(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get neighborhoods failed:', error);
      throw error;
    }
  }

  // Get neighborhoods by city
  async getNeighborhoodsByCity(cityId) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?cityId=${cityId}`);
      return response;
    } catch (error) {
      console.error('Get neighborhoods by city failed:', error);
      throw error;
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Get location suggestions based on partial input
  async getLocationSuggestions(query, type = 'both') {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.GEOCODE}/suggestions?q=${encodeURIComponent(query)}&type=${type}`);
      return response;
    } catch (error) {
      console.error('Get location suggestions failed:', error);
      throw error;
    }
  }

  // Validate address format
  validateAddress(address) {
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
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService;

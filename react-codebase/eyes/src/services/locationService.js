// import api, { ENDPOINTS } from './api'; // Not needed until backend is ready

class LocationService {
  // Geocode an address to get coordinates and location data (local fallback)
  async geocodeAddress(address) {
    try {
      // For now, use local address parsing since backend endpoints don't exist
      console.log('Using local address parsing - backend geocoding not ready yet');
      
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
      
      return {
        city: detectedCity,
        neighborhood: detectedNeighborhood,
        state: 'Demo State',
        country: 'USA',
        coordinates: [47.6062, -122.3321], // Seattle coordinates as example
        bounds: null
      };
      
      /* TODO: Uncomment when backend geocoding endpoint is ready
      const response = await api.post(ENDPOINTS.LOCATION.GEOCODE, { address });
      return response;
      */
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates to get address and location data (local fallback)
  async reverseGeocode(lat, lng) {
    try {
      // For now, return mock data since backend endpoints don't exist
      console.log('Using local reverse geocoding - backend endpoint not ready yet');
      
      return {
        address: 'Demo Address',
        city: 'Demo City',
        neighborhood: 'Demo Neighborhood',
        state: 'Demo State',
        country: 'USA'
      };
      
      /* TODO: Uncomment when backend reverse geocoding endpoint is ready
      const response = await api.post(ENDPOINTS.LOCATION.REVERSE_GEOCODE, { lat, lng });
      return response;
      */
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  // Get or create city from address (local fallback)
  async getOrCreateCity(address) {
    try {
      // For now, use local address parsing since backend endpoints don't exist
      console.log('Using local city detection - backend endpoints not ready yet');
      
      // Use the local geocoding function
      const geocodeResult = await this.geocodeAddress(address);
      
      if (geocodeResult.city) {
        return {
          _id: `${geocodeResult.city.toLowerCase().replace(/\s+/g, '-')}-1`,
          name: geocodeResult.city,
          state: geocodeResult.state,
          country: geocodeResult.country,
          coordinates: geocodeResult.coordinates
        };
      }
      
      throw new Error('Could not determine city from address');
      
      /* TODO: Uncomment when backend city endpoints are ready
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
      */
    } catch (error) {
      console.error('Get or create city failed:', error);
      throw error;
    }
  }

  // Get or create neighborhood from address (local fallback)
  async getOrCreateNeighborhood(address, cityId) {
    try {
      // For now, use local address parsing since backend endpoints don't exist
      console.log('Using local neighborhood detection - backend endpoints not ready yet');
      
      // Use the local geocoding function
      const geocodeResult = await this.geocodeAddress(address);
      
      if (geocodeResult.neighborhood) {
        return {
          _id: `${geocodeResult.neighborhood.toLowerCase().replace(/\s+/g, '-')}-1`,
          name: geocodeResult.neighborhood,
          cityId: cityId,
          coordinates: geocodeResult.coordinates,
          bounds: null
        };
      }
      
      throw new Error('Could not determine neighborhood from address');
      
      /* TODO: Uncomment when backend neighborhood endpoints are ready
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
      */
    } catch (error) {
      console.error('Get or create neighborhood failed:', error);
      throw error;
    }
  }

  // Set user location from address (local fallback)
  async setLocationFromAddress(address) {
    try {
      // For now, use local address parsing since backend endpoints don't exist
      console.log('Using local location setting - backend endpoints not ready yet');
      
      // Get or create city first
      const city = await this.getOrCreateCity(address);
      
      // Get or create neighborhood
      const neighborhood = await this.getOrCreateNeighborhood(address, city._id);
      
      // Return location data
      return {
        success: true,
        city: city.name,
        cityId: city._id,
        neighborhood: neighborhood.name,
        neighborhoodId: neighborhood._id,
        coordinates: neighborhood.coordinates,
        address: address
      };
      
      /* TODO: Uncomment when backend location endpoints are ready
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
      */
    } catch (error) {
      console.error('Set location from address failed:', error);
      throw error;
    }
  }

  // Get nearby users (placeholder until backend is ready)
  async getNearbyUsers(radius = 5) {
    try {
      // For now, return empty array since backend endpoint doesn't exist
      console.log('getNearbyUsers not implemented yet - backend endpoint not ready');
      return { users: [] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const response = await api.get(`${ENDPOINTS.USERS.NEARBY}?radius=${radius}`);
      return response;
      */
    } catch (error) {
      console.error('Get nearby users failed:', error);
      throw error;
    }
  }

  // Get cities (placeholder until backend is ready)
  async getCities(filters = {}) {
    try {
      // For now, return demo cities since backend endpoint doesn't exist
      console.log('Using demo cities - backend endpoint not ready yet');
      return { cities: ['Seattle', 'Demo City'] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.CITIES}?${queryParams.toString()}`);
      return response;
      */
    } catch (error) {
      console.error('Get cities failed:', error);
      throw error;
    }
  }

  // Get neighborhoods (placeholder until backend is ready)
  async getNeighborhoods(filters = {}) {
    try {
      // For now, return demo neighborhoods since backend endpoint doesn't exist
      console.log('Using demo neighborhoods - backend endpoint not ready yet');
      return { neighborhoods: ['Capitol Hill', 'Downtown Seattle', 'Demo Neighborhood'] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?${queryParams.toString()}`);
      return response;
      */
    } catch (error) {
      console.error('Get neighborhoods failed:', error);
      throw error;
    }
  }

  // Get neighborhoods by city (placeholder until backend is ready)
  async getNeighborhoodsByCity(cityId) {
    try {
      // For now, return demo neighborhoods since backend endpoint doesn't exist
      console.log('Using demo neighborhoods by city - backend endpoint not ready yet');
      return { neighborhoods: ['Capitol Hill', 'Downtown Seattle', 'Demo Neighborhood'] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const response = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?cityId=${cityId}`);
      return response;
      */
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
    return deg * (Math.PI / 180);
  }

  // Get location suggestions based on partial input (placeholder until backend is ready)
  async getLocationSuggestions(query, type = 'both') {
    try {
      // For now, return demo suggestions since backend endpoint doesn't exist
      console.log('Using demo location suggestions - backend endpoint not ready yet');
      return { suggestions: ['Seattle, WA', 'New York, NY', 'Los Angeles, CA'] };
      
      /* TODO: Uncomment when backend endpoint is ready
      const response = await api.get(`${ENDPOINTS.LOCATION.GEOCODE}/suggestions?q=${encodeURIComponent(query)}&type=${type}`);
      return response;
      */
    } catch (error) {
      console.error('Get location suggestions failed:', error);
      throw error;
    }
  }

  // Validate address format (basic validation)
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

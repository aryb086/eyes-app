import api, { ENDPOINTS } from './api';

class LocationService {
  // Get all cities
  async getCities() {
    try {
      const response = await api.get(ENDPOINTS.LOCATION.CITIES);
      return response;
    } catch (error) {
      console.error('Get cities failed:', error);
      throw error;
    }
  }

  // Get neighborhoods by city
  async getNeighborhoods(city) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.NEIGHBORHOODS}?city=${encodeURIComponent(city)}`);
      return response;
    } catch (error) {
      console.error('Get neighborhoods failed:', error);
      throw error;
    }
  }

  // Create or get location container
  async createLocationContainer(locationData) {
    try {
      const response = await api.post(ENDPOINTS.LOCATION.CREATE_CONTAINER, locationData);
      return response;
    } catch (error) {
      console.error('Create location container failed:', error);
      throw error;
    }
  }

  // Get location container by coordinates
  async getLocationContainer(lat, lng, radius = 5000) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.GET_CONTAINER}?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response;
    } catch (error) {
      console.error('Get location container failed:', error);
      throw error;
    }
  }

  // Get nearby location containers
  async getNearbyContainers(lat, lng, radius = 10000) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.NEARBY_CONTAINERS}?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response;
    } catch (error) {
      console.error('Get nearby containers failed:', error);
      throw error;
    }
  }

  // Update location container
  async updateLocationContainer(containerId, updateData) {
    try {
      const response = await api.put(`${ENDPOINTS.LOCATION.UPDATE_CONTAINER}/${containerId}`, updateData);
      return response;
    } catch (error) {
      console.error('Update location container failed:', error);
      throw error;
    }
  }

  // Get posts for a specific location container
  async getLocationPosts(containerId, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.GET_POSTS}/${containerId}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get location posts failed:', error);
      throw error;
    }
  }

  // Search locations by query
  async searchLocations(query) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.SEARCH}?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.error('Search locations failed:', error);
      throw error;
    }
  }

  // Get trending locations
  async getTrendingLocations(limit = 10) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.TRENDING}?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Get trending locations failed:', error);
      throw error;
    }
  }

  // Get location statistics
  async getLocationStats(containerId) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.STATS}/${containerId}`);
      return response;
    } catch (error) {
      console.error('Get location stats failed:', error);
      throw error;
    }
  }

  // Subscribe to location updates
  async subscribeToLocation(containerId) {
    try {
      const response = await api.post(`${ENDPOINTS.LOCATION.SUBSCRIBE}/${containerId}`);
      return response;
    } catch (error) {
      console.error('Subscribe to location failed:', error);
      throw error;
    }
  }

  // Unsubscribe from location updates
  async unsubscribeFromLocation(containerId) {
    try {
      const response = await api.post(`${ENDPOINTS.LOCATION.UNSUBSCRIBE}/${containerId}`);
      return response;
    } catch (error) {
      console.error('Unsubscribe from location failed:', error);
      throw error;
    }
  }

  // Get user's subscribed locations
  async getSubscribedLocations() {
    try {
      const response = await api.get(ENDPOINTS.LOCATION.SUBSCRIBED);
      return response;
    } catch (error) {
      console.error('Get subscribed locations failed:', error);
      throw error;
    }
  }

  // Validate location data
  validateLocationData(locationData) {
    const required = ['city', 'neighborhood', 'coordinates'];
    const missing = required.filter(field => !locationData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required location fields: ${missing.join(', ')}`);
    }

    if (!Array.isArray(locationData.coordinates) || locationData.coordinates.length !== 2) {
      throw new Error('Coordinates must be an array with [longitude, latitude]');
    }

    const [lng, lat] = locationData.coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number') {
      throw new Error('Coordinates must be numbers');
    }

    if (lng < -180 || lng > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    if (lat < -90 || lat > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }

    return true;
  }

  // Create location container with validation
  async createLocationContainerWithValidation(locationData) {
    try {
      this.validateLocationData(locationData);
      
      const containerData = {
        ...locationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        post_count: 0,
        subscriber_count: 0,
        is_active: true
      };

      return await this.createLocationContainer(containerData);
    } catch (error) {
      console.error('Create location container with validation failed:', error);
      throw error;
    }
  }

  // Get or create location container
  async getOrCreateLocationContainer(locationData) {
    try {
      this.validateLocationData(locationData);
      
      const [lng, lat] = locationData.coordinates;
      
      // First try to get existing container
      try {
        const existingContainer = await this.getLocationContainer(lat, lng, 1000); // 1km radius
        if (existingContainer && existingContainer.data) {
          return existingContainer;
        }
      } catch (error) {
        // Container doesn't exist, create new one
        console.log('No existing container found, creating new one');
      }

      // Create new container
      return await this.createLocationContainerWithValidation(locationData);
    } catch (error) {
      console.error('Get or create location container failed:', error);
      throw error;
    }
  }
}

export default new LocationService();

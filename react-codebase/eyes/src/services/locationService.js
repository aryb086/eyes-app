import api, { ENDPOINTS } from './api';

class LocationService {
  // Get all cities
  async getCities() {
    try {
      const response = await api.get(ENDPOINTS.LOCATION.GET_CITIES);
      return response;
    } catch (error) {
      console.error('Get cities failed:', error);
      throw error;
    }
  }

  // Get neighborhoods (optionally filtered by city)
  async getNeighborhoods(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await api.get(`${ENDPOINTS.LOCATION.GET_NEIGHBORHOODS}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Get neighborhoods failed:', error);
      throw error;
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.GEOCODE}?address=${encodeURIComponent(address)}`);
      return response;
    } catch (error) {
      console.error('Geocode address failed:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lat, lng) {
    try {
      const response = await api.get(`${ENDPOINTS.LOCATION.REVERSE_GEOCODE}?lat=${lat}&lng=${lng}`);
      return response;
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      throw error;
    }
  }
}

export default new LocationService();

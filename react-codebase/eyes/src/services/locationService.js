// Real city and neighborhood data
const cityData = {
  'Seattle': {
    neighborhoods: [
      'Downtown', 'Belltown', 'South Lake Union', 'Capitol Hill', 'First Hill',
      'Central District', 'Madison Valley', 'Madison Park', 'Leschi', 'Mount Baker',
      'Columbia City', 'Rainier Valley', 'Beacon Hill', 'Georgetown', 'South Park',
      'West Seattle', 'Alki', 'Admiral District', 'Highland Park', 'Delridge',
      'Northgate', 'Lake City', 'Wedgwood', 'Ravenna', 'Green Lake',
      'Fremont', 'Wallingford', 'Greenwood', 'Phinney Ridge', 'Ballard',
      'Magnolia', 'Queen Anne', 'Interbay', 'Belltown', 'Denny Triangle'
    ],
    state: 'WA',
    coordinates: { lat: 47.6062, lng: -122.3321 }
  },
  'San Francisco': {
    neighborhoods: [
      'Financial District', 'North Beach', 'Chinatown', 'Nob Hill', 'Russian Hill',
      'Telegraph Hill', 'Fisherman\'s Wharf', 'Marina District', 'Pacific Heights',
      'Cow Hollow', 'Presidio Heights', 'Laurel Heights', 'Richmond District',
      'Sunset District', 'Golden Gate Park', 'Haight-Ashbury', 'Cole Valley',
      'Glen Park', 'Noe Valley', 'Mission District', 'Potrero Hill',
      'Dogpatch', 'Bayview', 'Hunters Point', 'Visitacion Valley', 'Excelsior',
      'Outer Mission', 'Bernal Heights', 'Portola', 'Silver Terrace', 'Crocker Amazon'
    ],
    state: 'CA',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  'New York': {
    neighborhoods: [
      'Financial District', 'Battery Park City', 'Tribeca', 'SoHo', 'Nolita',
      'Little Italy', 'Chinatown', 'Lower East Side', 'East Village', 'Greenwich Village',
      'West Village', 'Chelsea', 'Flatiron District', 'Gramercy Park', 'Murray Hill',
      'Kips Bay', 'Turtle Bay', 'Midtown East', 'Midtown West', 'Hell\'s Kitchen',
      'Upper East Side', 'Upper West Side', 'Morningside Heights', 'Harlem', 'East Harlem',
      'Washington Heights', 'Inwood', 'Marble Hill', 'Williamsburg', 'Greenpoint',
      'Bushwick', 'Bedford-Stuyvesant', 'Crown Heights', 'Prospect Heights', 'Park Slope',
      'Gowanus', 'Carroll Gardens', 'Cobble Hill', 'Boerum Hill', 'Red Hook',
      'Sunset Park', 'Bay Ridge', 'Dyker Heights', 'Bensonhurst', 'Gravesend',
      'Sheepshead Bay', 'Brighton Beach', 'Coney Island', 'Flatbush', 'Midwood',
      'Kensington', 'Ditmas Park', 'Borough Park', 'Kings Highway', 'Flatlands',
      'Canarsie', 'East New York', 'Brownsville', 'Astoria', 'Long Island City',
      'Sunnyside', 'Woodside', 'Jackson Heights', 'Elmhurst', 'Corona',
      'Flushing', 'College Point', 'Whitestone', 'Bayside', 'Douglaston',
      'Little Neck', 'Glen Oaks', 'Bellerose', 'Queens Village', 'Hollis',
      'Jamaica', 'St. Albans', 'Laurelton', 'Rosedale', 'Springfield Gardens',
      'Cambria Heights', 'Briarwood', 'Kew Gardens', 'Forest Hills', 'Rego Park',
      'Middle Village', 'Maspeth', 'Ridgewood', 'Riverdale', 'Spuyten Duyvil',
      'Kingsbridge', 'Marble Hill', 'Inwood', 'Washington Heights', 'University Heights',
      'Morris Heights', 'Highbridge', 'Concourse', 'Mount Eden', 'Mount Hope',
      'Crotona Park', 'Tremont', 'Belmont', 'Fordham', 'St. George', 'Tompkinsville',
      'Stapleton', 'Clifton', 'Rosebank', 'Fort Wadsworth', 'New Dorp',
      'Midland Beach', 'Great Kills', 'Eltingville', 'Annadale', 'Huguenot',
      'Prince\'s Bay', 'Tottenville', 'Richmond Valley'
    ],
    state: 'NY',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  'Los Angeles': {
    neighborhoods: [
      'Downtown LA', 'Echo Park', 'Silver Lake', 'Los Feliz', 'Hollywood',
      'West Hollywood', 'Beverly Hills', 'Bel Air', 'Brentwood', 'Westwood',
      'Culver City', 'Marina del Rey', 'Venice', 'Santa Monica', 'Pacific Palisades',
      'Malibu', 'Topanga', 'Calabasas', 'Woodland Hills', 'Encino',
      'Sherman Oaks', 'Studio City', 'North Hollywood', 'Toluca Lake', 'Burbank',
      'Glendale', 'Pasadena', 'Eagle Rock', 'Highland Park', 'Mount Washington',
      'Elysian Valley', 'Lincoln Heights', 'Boyle Heights', 'East LA', 'Montebello',
      'Whittier', 'Downey', 'Norwalk', 'Cerritos', 'Artesia', 'Long Beach'
    ],
    state: 'CA',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  'Chicago': {
    neighborhoods: [
      'Loop', 'River North', 'Streeterville', 'Gold Coast', 'Old Town',
      'Lincoln Park', 'Lakeview', 'Wrigleyville', 'Boystown', 'Uptown',
      'Edgewater', 'Rogers Park', 'West Ridge', 'Lincoln Square', 'North Center',
      'Avondale', 'Logan Square', 'Humboldt Park', 'West Town', 'Ukrainian Village',
      'Wicker Park', 'Bucktown', 'Noble Square', 'East Village', 'West Loop',
      'Fulton Market', 'Near West Side', 'University Village', 'Pilsen', 'Bridgeport',
      'Chinatown', 'Bronzeville', 'Hyde Park', 'Kenwood', 'Woodlawn', 'South Shore'
    ],
    state: 'IL',
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  'Austin': {
    neighborhoods: [
      'Downtown', 'East Austin', 'West Campus', 'North Campus', 'Hyde Park',
      'Rosedale', 'Allandale', 'Crestview', 'Brentwood', 'Highland',
      'North Loop', 'Windsor Park', 'Mueller', 'Hancock', 'St. Johns',
      'Windsor Hills', 'Rundberg', 'Riverside', 'Montopolis', 'Pleasant Valley',
      'Travis Heights', 'Bouldin Creek', 'Zilker', 'Barton Hills', 'South Lamar',
      'South Austin', 'Circle C', 'Oak Hill', 'Westlake', 'Lake Travis'
    ],
    state: 'TX',
    coordinates: { lat: 30.2672, lng: -97.7431 }
  }
};

// Geocoding service using OpenStreetMap Nominatim API
class LocationService {
  constructor() {
    this.cityData = cityData;
  }

  // Get all available cities
  getCities() {
    return Object.keys(this.cityData);
  }

  // Get neighborhoods for a specific city
  getNeighborhoods(city) {
    const cityInfo = this.cityData[city];
    if (!cityInfo) return [];
    
    // Handle nested neighborhood structure (like NYC)
    if (Array.isArray(cityInfo.neighborhoods)) {
      return cityInfo.neighborhoods;
    } else if (typeof cityInfo.neighborhoods === 'object') {
      // Flatten nested neighborhoods (e.g., Manhattan, Brooklyn, etc.)
      return Object.values(cityInfo.neighborhoods).flat();
    }
    
    return [];
  }

  // Get city info including state and coordinates
  getCityInfo(city) {
    return this.cityData[city] || null;
  }

  // Geocode address to get coordinates and location info
  async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }

      const result = data[0];
      const addressParts = result.address;
      
      // Extract city and neighborhood information
      const city = addressParts.city || addressParts.town || addressParts.village || addressParts.county;
      const neighborhood = addressParts.suburb || addressParts.neighbourhood || addressParts.district;
      const state = addressParts.state;
      const country = addressParts.country;
      
      return {
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        },
        city,
        neighborhood,
        state,
        country,
        fullAddress: result.display_name,
        confidence: result.importance
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Reverse geocode coordinates to get address
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }

      const result = await response.json();
      const addressParts = result.address;
      
      return {
        city: addressParts.city || addressParts.town || addressParts.village || addressParts.county,
        neighborhood: addressParts.suburb || addressParts.neighbourhood || addressParts.district,
        state: addressParts.state,
        country: addressParts.country,
        fullAddress: result.display_name
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Find nearest city and neighborhood based on coordinates
  findNearestLocation(lat, lng) {
    let nearestCity = null;
    let nearestDistance = Infinity;
    
    for (const [cityName, cityInfo] of Object.entries(this.cityData)) {
      const cityLat = cityInfo.coordinates.lat;
      const cityLng = cityInfo.coordinates.lng;
      
      const distance = this.calculateDistance(lat, lng, cityLat, cityLng);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCity = cityName;
      }
    }
    
    return {
      city: nearestCity,
      distance: nearestDistance,
      neighborhoods: this.getNeighborhoods(nearestCity)
    };
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Auto-detect location from user's IP or browser geolocation
  async autoDetectLocation() {
    try {
      // Try browser geolocation first
      if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const location = await this.reverseGeocode(latitude, longitude);
                const nearest = this.findNearestLocation(latitude, longitude);
                
                resolve({
                  ...location,
                  coordinates: { lat: latitude, lng: longitude },
                  nearestCity: nearest.city,
                  nearestNeighborhoods: nearest.neighborhoods
                });
              } catch (error) {
                reject(error);
              }
            },
            (error) => {
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        });
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Auto-detection error:', error);
      throw error;
    }
  }
}

const locationService = new LocationService();
export default locationService;

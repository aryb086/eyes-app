// Sample data for US cities and neighborhoods
// In a real app, this would come from an API
const usStates = [
  { code: 'CA', name: 'California' },
  { code: 'NY', name: 'New York' },
  { code: 'TX', name: 'Texas' },
  { code: 'FL', name: 'Florida' },
  { code: 'IL', name: 'Illinois' },
  // Add more states as needed
];

// Sample cities with neighborhoods
const cities = {
  'CA': [
    {
      id: 'los-angeles',
      name: 'Los Angeles',
      neighborhoods: [
        'Downtown', 'Hollywood', 'Santa Monica', 'Venice', 'Silver Lake', 'Echo Park'
      ]
    },
    {
      id: 'san-francisco',
      name: 'San Francisco',
      neighborhoods: [
        'Mission District', 'SOMA', 'Haight-Ashbury', 'Marina', 'Castro', 'Sunset'
      ]
    }
  ],
  'NY': [
    {
      id: 'new-york',
      name: 'New York',
      neighborhoods: [
        'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Harlem', 'Chinatown'
      ]
    },
    {
      id: 'buffalo',
      name: 'Buffalo',
      neighborhoods: [
        'Allentown', 'Elmwood Village', 'North Buffalo', 'West Side', 'South Buffalo'
      ]
    }
  ]
  // Add more cities as needed
};

// Get all states
export const getStates = () => {
  return usStates;
};

// Get cities by state
export const getCitiesByState = (stateCode) => {
  return cities[stateCode] || [];
};

// Get neighborhoods by city
export const getNeighborhoods = (stateCode, cityId) => {
  const city = (cities[stateCode] || []).find(c => c.id === cityId);
  return city ? city.neighborhoods : [];
};

// Get full location details
export const getLocationDetails = (stateCode, cityId, neighborhood) => {
  const state = usStates.find(s => s.code === stateCode);
  if (!state) return null;
  
  const city = (cities[stateCode] || []).find(c => c.id === cityId);
  if (!city) return null;
  
  return {
    state: state.name,
    stateCode: state.code,
    city: city.name,
    cityId: city.id,
    neighborhood: neighborhood || null
  };
};

// Get current user's location (from localStorage or default)
export const getUserLocation = () => {
  const savedLocation = localStorage.getItem('userLocation');
  if (savedLocation) {
    return JSON.parse(savedLocation);
  }
  
  // Default location (can be changed by user)
  return {
    stateCode: 'CA',
    cityId: 'los-angeles',
    neighborhood: 'Downtown'
  };
};

// Save user's location
export const saveUserLocation = (location) => {
  localStorage.setItem('userLocation', JSON.stringify(location));
};

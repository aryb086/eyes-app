// Sample cities data (you can expand this)
const cities = [
  { name: 'Seattle', state: 'WA', country: 'USA' },
  { name: 'Demo City', state: 'Demo State', country: 'Demo Country' },
  { name: 'New York', state: 'NY', country: 'USA' },
  { name: 'Los Angeles', state: 'CA', country: 'USA' },
  { name: 'Chicago', state: 'IL', country: 'USA' },
  { name: 'Miami', state: 'FL', country: 'USA' },
  { name: 'Austin', state: 'TX', country: 'USA' },
  { name: 'Denver', state: 'CO', country: 'USA' },
  { name: 'Portland', state: 'OR', country: 'USA' },
  { name: 'San Francisco', state: 'CA', country: 'USA' }
];

// Sample neighborhoods data (you can expand this)
const neighborhoods = [
  { name: 'Demo Neighborhood', city: 'Demo City', state: 'Demo State' },
  { name: 'Downtown', city: 'Seattle', state: 'WA' },
  { name: 'Capitol Hill', city: 'Seattle', state: 'WA' },
  { name: 'Ballard', city: 'Seattle', state: 'WA' },
  { name: 'Fremont', city: 'Seattle', state: 'WA' },
  { name: 'Queen Anne', city: 'Seattle', state: 'WA' },
  { name: 'Green Lake', city: 'Seattle', state: 'WA' },
  { name: 'Wallingford', city: 'Seattle', state: 'WA' },
  { name: 'University District', city: 'Seattle', state: 'WA' },
  { name: 'West Seattle', city: 'Seattle', state: 'WA' }
];

// Get all cities
const getCities = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: cities.length,
      cities: cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// Get neighborhoods (optionally filtered by city)
const getNeighborhoods = async (req, res) => {
  try {
    const { city } = req.query;
    
    let filteredNeighborhoods = neighborhoods;
    if (city) {
      filteredNeighborhoods = neighborhoods.filter(n => 
        n.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: filteredNeighborhoods.length,
      neighborhoods: filteredNeighborhoods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching neighborhoods',
      error: error.message
    });
  }
};

// Geocode address to coordinates
const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address parameter is required'
      });
    }

    // For now, return demo coordinates
    // In production, you'd integrate with Google Maps API or similar
    const coordinates = {
      type: 'Point',
      coordinates: [47.6062, -122.3321] // Seattle coordinates as fallback
    };

    res.status(200).json({
      success: true,
      data: {
        address,
        coordinates,
        city: 'Demo City',
        neighborhood: 'Demo Neighborhood'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error geocoding address',
      error: error.message
    });
  }
};

// Reverse geocode coordinates to address
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    // For now, return demo location data
    // In production, you'd integrate with Google Maps API or similar
    const location = {
      city: 'Demo City',
      neighborhood: 'Demo Neighborhood',
      state: 'Demo State',
      country: 'Demo Country'
    };

    res.status(200).json({
      success: true,
      data: {
        coordinates: [parseFloat(lat), parseFloat(lng)],
        location
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reverse geocoding coordinates',
      error: error.message
    });
  }
};

// Create new city (protected route)
const createCity = async (req, res) => {
  try {
    const { name, state, country } = req.body;
    
    if (!name || !state || !country) {
      return res.status(400).json({
        success: false,
        message: 'Name, state, and country are required'
      });
    }

    // In production, you'd save to database
    const newCity = { name, state, country };
    cities.push(newCity);

    res.status(201).json({
      success: true,
      data: newCity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating city',
      error: error.message
    });
  }
};

// Create new neighborhood (protected route)
const createNeighborhood = async (req, res) => {
  try {
    const { name, city, state } = req.body;
    
    if (!name || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Name, city, and state are required'
      });
    }

    // In production, you'd save to database
    const newNeighborhood = { name, city, state };
    neighborhoods.push(newNeighborhood);

    res.status(201).json({
      success: true,
      data: newNeighborhood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating neighborhood',
      error: error.message
    });
  }
};

module.exports = {
  getCities,
  getNeighborhoods,
  geocodeAddress,
  reverseGeocode,
  createCity,
  createNeighborhood
};

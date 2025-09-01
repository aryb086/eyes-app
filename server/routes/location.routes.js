const express = require('express');
const {
  geocodeAddress,
  reverseGeocode,
  getNearbyNeighborhoods,
  getCities,
  getNeighborhoods
} = require('../controllers/location.controller');

const router = express.Router();

// Geocoding routes
router.post('/geocode', geocodeAddress);
router.post('/reverse-geocode', reverseGeocode);
router.post('/nearby-neighborhoods', getNearbyNeighborhoods);

// Static location data routes
router.get('/cities', getCities);
router.get('/neighborhoods', getNeighborhoods);

module.exports = router;
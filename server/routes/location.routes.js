const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

// Import location controller
const locationController = require('../controllers/location.controller');

// Public routes (no authentication required)
router.get('/cities', locationController.getCities);
router.get('/neighborhoods', locationController.getNeighborhoods);
router.get('/geocode', locationController.geocodeAddress);
router.get('/reverse-geocode', locationController.reverseGeocode);

// Protected routes (authentication required)
router.post('/cities', protect, locationController.createCity);
router.post('/neighborhoods', protect, locationController.createNeighborhood);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validate.middleware');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, authController.register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', validateLogin, authController.login); 
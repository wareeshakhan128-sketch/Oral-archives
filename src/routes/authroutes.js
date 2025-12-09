const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Handles: POST /api/auth/register (For the "Create Account" form)
router.post('/register', registerUser);

// Handles: POST /api/auth/login (For the "Log In" form)
router.post('/login', loginUser);

module.exports = router;
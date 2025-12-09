const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

// GET /api/users/:id 
// Fetches a user's public profile and their approved stories.
router.get('/:id', getUserProfile);

module.exports = router;
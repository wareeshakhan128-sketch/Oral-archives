const express = require('express');
const router = express.Router();
const { getCompetitions, submitEntry } = require('../controllers/competitionController');
const { protect } = require('../middleware/authmiddleware');

// GET /api/competitions
// Fetches a list of active and upcoming competitions
router.get('/', getCompetitions);

// POST /api/competitions/entry
// Allows an authenticated user to submit a story to an active competition
router.post('/entry', protect, submitEntry); 

module.exports = router;
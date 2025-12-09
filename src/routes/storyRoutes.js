const express = require('express');
const router = express.Router();
const { getStories, createStory } = require('../controllers/storyController');
const { protect } = require('../middleware/authmiddleware');

// GET /api/stories (Public: for the homepage list/filters)
router.get('/', getStories);

// POST /api/stories (Protected: for "Submit Your Story" form)
router.post('/', protect, createStory); 

module.exports = router;
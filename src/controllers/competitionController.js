const db = require('../config/db');

// --- GET COMPETITIONS ---
const getCompetitions = async (req, res) => {
  try {
    // Fetch only competitions that are 'active' or 'upcoming'
    const query = `
      SELECT 
          competition_id, title, description, word_limit, start_date, end_date, status
      FROM competitions
      WHERE status IN ('active', 'upcoming')
      ORDER BY start_date ASC;
    `;

    const [competitions] = await db.query(query);

    res.status(200).json(competitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching competitions.' });
  }
};

// --- SUBMIT ENTRY ---
const submitEntry = async (req, res) => {
  // user_id is passed from the JWT via the 'protect' middleware
  const user_id = req.user_id; 
  const { competition_id, content, word_count } = req.body;

  if (!competition_id || !content || !word_count) {
    return res.status(400).json({ message: 'Please include competition ID, content, and word count.' });
  }

  try {
    // 1. Check if the competition is active and check the word limit
    const [compCheck] = await db.query(
      'SELECT status, word_limit FROM competitions WHERE competition_id = ?', 
      [competition_id]
    );

    if (compCheck.length === 0) {
      return res.status(404).json({ message: 'Competition not found.' });
    }
    
    const competition = compCheck[0];

    if (competition.status !== 'active') {
      return res.status(403).json({ message: 'Competition is not currently active.' });
    }

    if (word_count > competition.word_limit) {
      return res.status(400).json({ message: `Entry exceeds the word limit of ${competition.word_limit} words.` });
    }

    // 2. Insert the entry into the 'competition_entries' table
    const [result] = await db.query(
      'INSERT INTO competition_entries (competition_id, user_id, content, word_count) VALUES (?, ?, ?, ?)',
      [competition_id, user_id, content, word_count]
    );

    res.status(201).json({
      entry_id: result.insertId,
      message: 'Competition entry submitted successfully!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting competition entry.' });
  }
};

module.exports = { getCompetitions, submitEntry };
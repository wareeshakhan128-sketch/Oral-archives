const db = require('../config/db');

// Logic for Fetching Stories (GET /api/stories)
const getStories = async (req, res) => {
  try {
    // This query joins stories with user (author) and category information
    const query = `
      SELECT 
          s.story_id, s.title, LEFT(s.content, 200) as snippet, 
          s.created_at, s.year,
          u.username AS author_name, 
          c.category_name
      FROM stories s
      JOIN users u ON s.user_id = u.user_id
      JOIN categories c ON s.category_id = c.category_id
      WHERE s.status = 'approved'
      ORDER BY s.created_at DESC
      LIMIT 25;
    `;

    const [stories] = await db.query(query);

    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stories.' });
  }
};

// Logic for Submitting a Story (POST /api/stories)
const createStory = async (req, res) => {
  // The user_id is automatically pulled from the JWT token via authMiddleware.
  const user_id = req.user_id; 
  const { title, content, category_id, country, region, year } = req.body;

  if (!title || !content || !category_id) {
    return res.status(400).json({ message: 'Please include title, content, and category.' });
  }

  try {
    // Inserts the story. The status defaults to 'pending' as per your SQL schema.
    const [result] = await db.query(
      'INSERT INTO stories (user_id, title, content, category_id, country, region, year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, title, content, category_id, country, region, year]
    );

    res.status(201).json({
      story_id: result.insertId,
      title,
      message: 'Story submitted successfully! It is currently pending approval.'
    });

  } catch (error) {
    res.status(500).json({ message: 'Error submitting story.' });
  }
};

module.exports = { getStories, createStory };
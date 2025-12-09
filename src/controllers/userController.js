const db = require('../config/db');

// Logic for fetching a User Profile
const getUserProfile = async (req, res) => {
  const { id } = req.params; // Get user ID from the URL parameter

  try {
    // 1. Fetch Public User Details
    const [userResult] = await db.query(
      'SELECT username, bio, region, archive_points, profile_picture, created_at FROM users WHERE user_id = ?', 
      [id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userResult[0];

    // 2. Fetch User's Approved Stories (for the profile page)
    const [stories] = await db.query(
      'SELECT story_id, title, LEFT(content, 200) AS snippet, year, created_at FROM stories WHERE user_id = ? AND status = "approved" ORDER BY created_at DESC', 
      [id]
    );

    // Combine profile details and stories into a single response
    res.status(200).json({
      profile: user,
      submitted_stories: stories
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

module.exports = { getUserProfile };
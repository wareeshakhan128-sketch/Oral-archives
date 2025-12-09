const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Helper to create a JWT
const generateToken = (id) => {
  return jwt.sign({ user_id: id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Logic for User Registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please include all required fields.' });
  }

  try {
    // 2. Hash password (using bcrypt)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert user into the 'users' table (role_id=1 for 'reader')
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, 1)',
      [username, email, password_hash]
    );

    const newUserId = result.insertId;

    res.status(201).json({
      user_id: newUserId,
      username: username,
      token: generateToken(newUserId), // Send token for immediate login
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Logic for User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const [users] = await db.query('SELECT user_id, username, password_hash FROM users WHERE email = ?', [email]);
    const user = users[0];

    // 2. Check password
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        user_id: user.user_id,
        username: user.username,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { registerUser, loginUser };
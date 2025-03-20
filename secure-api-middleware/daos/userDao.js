const pool = require('../config/db');

// Function to create a new user
const createUser = async (username, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error creating user');
  }
};


// Function to find a user by their username
const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
   );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

module.exports = { findUserByUsername, createUser };


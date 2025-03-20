const pool = require('../config/db');

// Function to create login information for the user
const createLoginInfo = async (registerId, authToken) => {
  try {
    const result = await pool.query(
      'INSERT INTO login_info (register_id, auth_token) VALUES ($1, $2) RETURNING *',
      [registerId, authToken]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error creating login info');
  }
};

module.exports = { createLoginInfo };

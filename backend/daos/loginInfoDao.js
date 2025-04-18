const pool = require('../config/db');

// Create login information for the user
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

// Check if the user already exists in the login_info table
const alreadyExistsUser = async (registerId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM login_info WHERE register_id = $1',
      [registerId]
   );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

// Update login information for the user
const updateUserLoginInfo = async (registerId, authToken) => {
  try {
    const result = await pool.query(
      'UPDATE login_info SET auth_token = $1, last_login = NOW() WHERE register_id = $2 RETURNING *',
      [authToken, registerId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error updating login info');
  }
};

module.exports = { createLoginInfo , alreadyExistsUser, updateUserLoginInfo };

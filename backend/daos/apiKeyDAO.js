const pool = require('../config/db');

// Create a new API key
const createApiKey = async (userId, apiKey) => {
  try {
      const result = await pool.query(
          'INSERT INTO api_keys (user_id, api_key, created_at) VALUES ($1, $2, NOW()) RETURNING *',
          [userId, apiKey]
      );
      return result.rows[0];
  } catch (error) {
      throw new Error('Error creating API key');
  }
};

// Retrieve API key by userId
const findApiKey = async (apiKey) => {
  try {
    const result = await pool.query('SELECT * FROM api_keys WHERE api_key = $1', [apiKey]);
    if (result.rows.length > 0) {
      return result.rows[0];  
    } else {
      return null;  
    }
  } catch (error) {
    console.error('Error finding API key:', error);
    throw error;  
  }
};

// Track API key usage
const trackApiKeyUsage = async (apiKeyId) => {
  try {
      await pool.query('UPDATE api_keys SET last_used = NOW(), usage_count = usage_count + 1 WHERE id = $1', [apiKeyId]);
  } catch (error) {
      throw new Error('Error tracking API key usage');
  }
};

// Delete an API key
const deleteApiKey = async (apiKeyId) => {
  try {
      await pool.query('DELETE FROM api_keys WHERE id = $1', [apiKeyId]);
  } catch (error) {
      throw new Error('Error deleting API key');
  }
};

// Get all API keys by userId
const getApiKeysByUserId = async (userId) => {
  try {
      const result = await pool.query('SELECT * FROM api_keys WHERE user_id = $1', [userId]);
      return result.rows;
  } catch (error) {
      throw new Error('Error fetching API keys by user ID');
  }
};

// Get all API keys
const getApiKeys= async (userId) => {
  try {
      const result = await pool.query('SELECT * FROM api_keys');
      return result.rows;
  } catch (error) {
      throw new Error('Error fetching API keys');
  }
};


module.exports = { createApiKey, findApiKey, trackApiKeyUsage, deleteApiKey, getApiKeysByUserId, getApiKeys };
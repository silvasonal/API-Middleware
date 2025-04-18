const apiKeyDAO = require('../daos/apiKeyDAO');
const { v4: uuidv4 } = require('uuid'); 

// Function to generate a new API key for a user
const generateApiKey = async (userId) => {
    const apiKey = uuidv4();     // Generate a new API key using UUID
    return apiKeyDAO.createApiKey(userId, apiKey);
};

// Function to delete an API key
const deleteApiKey = async (apiKeyId) => {
    return apiKeyDAO.deleteApiKey(apiKeyId);
};

// Function to get all API keys for a specific user
const getApiKeysByUserId = async (userId) => {
    return apiKeyDAO.getApiKeysByUserId(userId);
};

// Function to get all API keys
const getApiKeys = async () => {
    return apiKeyDAO.getApiKeys();
};

module.exports = { generateApiKey, deleteApiKey, getApiKeysByUserId, getApiKeys };
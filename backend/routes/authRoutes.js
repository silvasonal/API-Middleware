const express = require('express');
const useModel = require('../models/userModel');
const lodingInfoModel = require('../models/loginInfoModel');
const apiKeyModel = require('../models/apiKeyModel');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authenticateApiKey = require('../middleware/apiKeyMiddleware');
const countryService = require('../services/countryService');

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await useModel.registerUser(username, password);
    if (user.error) {
      return res.status(401).json({ error: user.error });
    }

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
      } 
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error registering user' 
    });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await lodingInfoModel.loginUser(username, password);
    if (user.error) {
      return res.status(401).json({ error: user.error });
    }

    res.status(200).json({
      message: 'User logged in successfully',
      token: user.token,
    });

  } catch (error) {
    res.status(500).json({
       error: 'Error logging in user' 
    });
  }
});

// Generate API Key Route
router.post('/generate-api-key', authenticateToken, async (req, res) => {
  try {
      const apiKey = await apiKeyModel.generateApiKey(req.user.userId);
      res.status(201).json({ apiKey: apiKey.api_key });
  } catch (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: 'Error generating API key' });
  }
});

// Delete API Key Route
router.delete('/api-key/:id', authenticateToken, async (req, res) => {
  try {
      await apiKeyModel.deleteApiKey(req.params.id);
      res.status(200).json({ message: 'API key deleted successfully' });
  } catch (error) {
      console.error('Error deleting API key:', error);
      res.status(500).json({ error: 'Error deleting API key' });
  }
});

// Get API Keys by User ID Route
router.get('/api-keys/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const apiKeys = await apiKeyModel.getApiKeysByUserId(userId);
    res.status(200).json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Error fetching API keys' });
  }
});

// Get Country Data Route
router.get('/country/:name', authenticateApiKey, async (req, res) => {
  
  const countryName = req.params.name 
  try {
    const countryData = await countryService.fetchCountry(countryName);

    if (countryData.error) {
      return res.status(404).json({ error: countryData.error });
    }

    res.json(countryData);
  } catch (error) {
    res.status(500).json({ error: countryData.error });
    console.log(error);
  }
});


// Admin-only route to change another user's role to 'admin'
router.patch('/make-admin/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can perform this action' });
    }

    const { userId } = req.params;

    const updatedUser = await useModel.changeUserRole(userId, 'admin');

    if (updatedUser?.error) {
      const statusCode = updatedUser.error === 'User not found' ? 404 : 400;
      return res.status(statusCode).json({ error: updatedUser.error });
    }

    res.status(200).json({
      message: 'User role updated to admin successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
});

// Admin-only route to change another admin's role to 'user'
router.patch('/make-user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can perform this action' });
    }

    const { userId } = req.params;

    const updatedUser = await useModel.changeUserRole(userId, 'user');

    if (updatedUser.error) {
      const statusCode = updatedUser.error === 'Invalid role' ? 400 : 404;
      return res.status(statusCode).json({ error: updatedUser.error });
    }

    return res.status(200).json({
      message: `Admin role updated to user successfully`,
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Error updating user role' });
  }
});

//Get all users route
router.get('/users/', authenticateToken, async (req, res) => {
  try {
    const users = await useModel.fetchAllUsers();

    if (users.error) {
      return res.status(500).json({ error: users.error });
    }
    res.status(200).json(users);
  } catch (error) { 
    console.error('Error fetching users:', error);
  }
});

//Get all apiKeys route
router.get('/apiKeys/', authenticateToken, async (req, res) => {
  try {
    const users = await apiKeyModel.getApiKeys();

    if (users.error) {
      return res.status(500).json({ error: users.error });
    }
    res.status(200).json(users);
  } catch (error) { 
    console.error('Error fetching users:', error);
  }
});

module.exports = router;
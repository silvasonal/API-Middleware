const express = require('express');
const axios = require('axios');
const useModel = require('../models/userModel');
const lodingInfoModel = require('../models/loginInfoModel');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const countryService = require('../services/countryService');

// User Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await useModel.registerUser(username, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await lodingInfoModel.loginUser(username, password);

    // Check if the login was successful or not
    if (user.error) {
      return res.status(400).json({ error: user.error });
    }

    res.status(200).json({
      message: 'User logged in successfully',
      token: user.token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});


// Get Country Data Route
router.get('/country/:name', authenticateToken, async (req, res) => {
  
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

module.exports = router;

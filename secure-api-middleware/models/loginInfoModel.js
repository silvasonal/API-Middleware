const jwt = require('jsonwebtoken');
const loginInfoDAO = require('../daos/loginInfoDAO');
const bcryptUtils = require('../utils/bcryptUtils');
const userDao = require('../daos/userDAO');
require('dotenv').config();

// Function to validate input
const validateInput = (username, password) => {
  if (!username) return { error: 'Username is required' };
  if (!password) return { error: 'Password is required' };
  return null;
};

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '45m' }
  );
};

// Function to log in a user
const loginUser = async (username, password) => {
  try {
    // Validate input
    const validationError = validateInput(username, password);
    if (validationError) return validationError;

    // Check if user exists
    const user = await userDao.findUserByUsername(username);
    if (!user) return { error: 'User does not exist' };

    // Check if password is valid
    const isPasswordValid = await bcryptUtils.comparePassword(password, user.password);
    if (!isPasswordValid) return { error: 'Password is incorrect' };

    // Generate JWT token
    const token = generateToken(user);

    // Create login info
    const loginInfo = await loginInfoDAO.createLoginInfo(user.id, token);

    return {
      message: 'Login successful',
      token,
      loginTime: loginInfo.login_time,
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    return { error: 'Error logging in user' };
  }
};

module.exports = { loginUser };

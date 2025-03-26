const bcryptUtils = require('../utils/bcryptUtils');
const userDao = require('../daos/userDAO');
require('dotenv').config();

// Function to validate input
const validateInput = (username, password) => {
  if (!username) return { error: 'Username is required' };
  if (!password) return { error: 'Password is required' };
  return null;
};

// Function to check for duplicate username
const isUsernameDuplicate = async (username) => {
  const user = await userDao.findUserByUsername(username);
  return user ? { error: 'Username already exists' } : null;
};

// Function to register a new user
const registerUser = async (username, password) => {
  const validationError = validateInput(username, password);
  if (validationError) return validationError;

  const duplicateError = await isUsernameDuplicate(username);
  if (duplicateError) return duplicateError;

  try {
    const hashedPassword = await bcryptUtils.hashPassword(password);
    return await userDao.createUser(username, hashedPassword);
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Error registering user' };
  }
};

module.exports = { registerUser };

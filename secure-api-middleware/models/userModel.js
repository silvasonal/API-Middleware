const bcryptUtils = require('../utils/bcryptUtils');
const userDao = require('../daos/userDAO');
require('dotenv').config();

// Function to register a new user
const registerUser = async (username, password) => {
  try {
    const hashedPassword = await bcryptUtils.hashPassword(password);
    const user = await userDao.createUser(username, hashedPassword);
    return user;

  } catch (error) {
    console.error('Error registering user', error);
    return { 
      error: 'Error registering user' 
    };
  }
};

module.exports = { registerUser };

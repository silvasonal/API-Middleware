const jwt = require('jsonwebtoken');
const loginInfoDAO = require('../daos/loginInfoDAO');
const bcryptUtils = require('../utils/bcryptUtils');
const userDao = require('../daos/userDAO');
require('dotenv').config();

// Function to log in a user
const loginUser = async (username, password) => {
  try {
    // Check if user exists
    const user = await userDao.findUserByUsername(username);
    if (!user) {
       return { error: 'Invalid credentials' };
    }

    // Check if password is valid
    const isPasswordValid = await bcryptUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );

    // Create login info
    const loginInfo = await loginInfoDAO.createLoginInfo(user.id, token);


    return {
      message: 'Login successful',
      token,
      loginTime: loginInfo.login_time,
    };
    
  } catch (error) {
      console.error('Error in loginUser:', error);
      return { 
        error: 'Error logging in user' 
      };
  }
};

module.exports = { loginUser };

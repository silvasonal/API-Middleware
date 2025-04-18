const bcryptUtils = require('../utils/bcryptUtils');
const userDao = require('../daos/userDao');
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
// Function to change user role
const changeUserRole = async (userId, newRole) => {
  if (!['admin', 'user'].includes(newRole)) {
    return { error: 'Invalid role' };
  }

  try {
    const updatedUser = await userDao.updateUserRole(userId, newRole);
    if (!updatedUser) {
      return { error: 'User not found' };
    }
    return { updatedUser };
  } catch (error) {
    return { error: 'Error updating user role' };
  }
};

// Function to fetch all users
const fetchAllUsers = async () => {
  try {
    const users = await userDao.getUsers();
    return users.map(user => ({
      id : user.id,
      username: user.username,
      role: user.role,
    }));
  } catch (error) {
    return { error: 'Error retrieving users' };
  }
};

module.exports = { registerUser, changeUserRole,fetchAllUsers };

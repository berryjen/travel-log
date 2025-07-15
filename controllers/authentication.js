// check if new user & email already exists in database
//  if new user, create new uer in db
//  if new user exists, don't create --> error handling to display to user that user exists

const bcrypt = require('bcryptjs');
const db = require('../db/db');

const register = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // Check if user exists using Knex
    const existingUser = await db('user_name')
      .where({ userEmail })
      .first();

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // Create new user using Knex
    const [newUser] = await db('users')
      .insert({
        userName,
        userEmail,
        userPassword: hashedPassword,
      })
      .returning(['id', 'userName', 'userEmail']);

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'An error occurred during registration',
    });
  }
};

module.exports = {
  register,
};

// check if new user & email already exists in database
//  if new user, create new uer in db
//  if new user exists, don't create --> error handling to display to user that user exists

const bcrypt = require('bcryptjs');
const db = require('../db/db');

const register = async (req, res) => {
  try {
    const { userEmail, userPassword, name } = req.body;
    console.log('Registering user:', { reqBody: req.body });
    // Check if user exists using Knex
    const existingUser = await db('users')
      .where({ userEmail })
      .first('id');

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
        name,
        userEmail,
        userPassword: hashedPassword,
      })
      .returning(['id', 'userEmail']);

    return res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: `An error occurred during registration: ${error.name}: ${error.message}`,
    });
  }
};

module.exports = {
  register,
};

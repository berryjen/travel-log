// check if new user & email already exists in database
//  if new user, create new uer in db
//  if new user exists, don't create --> error handling to display to user that user exists

const bcrypt = require('bcryptjs');
const db = require('../db/db');

const register = async (req, res) => {
  try {
    const { userEmail, userPassword, name } = req.body;
    console.log('Registering user:', { reqBody: req.body });
    const existingUser = await db('users')
      .where({ userEmail })
      .first('id');

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const [newUser] = await db('users')
      .insert({
        name,
        userEmail,
        userPassword: hashedPassword,
      })
      .returning(['userPassword', 'userEmail']);

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

const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    console.log('Logging in user:', { reqBody: req.body });

    const existingUser = await db('users')
      .where({ user_email: userEmail })
      .first('user_password', 'user_email', 'name');
    console.log('user from DB:', existingUser);

    if (!existingUser) {
      return res.status(401).json({
        error: 'User not found with this email',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      existingUser.userPassword,
      console.log('Debug:', {
        userPassword,
        existingUserPassword: existingUser.userPassword,
        existingUser,
      }),
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    return res.status(200).json({
      message: 'User logged in successfully',
      user: existingUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: `An error occurred during login: ${error.name}: ${error.message}`,
    });
  }
};
module.exports = {
  register,
  login,
};

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
      .first('id', 'user_password', 'user_email', 'name');
    console.log('user from DB:', existingUser);
    console.log('Object.keys(existingUser):', Object.keys(existingUser || {}));

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

    // ✅ req.login() triggers the session creation
    // This will call passport.serializeUser() which stores user.id in the session
    // express-session will then send a Set-Cookie header with the session ID
    return req.login(existingUser, (err) => {
      if (err) {
        console.error('Session creation error:', err);
        return res.status(500).json({
          error: 'Failed to create session',
        });
      }

      console.log('✅ Session created successfully!');
      console.log('req.session after login:', req.session);
      console.log('req.sessionID:', req.sessionID);
      console.log('Set-Cookie header will be sent with sessionID:', req.sessionID);

      // Session is now established, Set-Cookie header will be sent automatically
      return res.status(200).json({
        message: 'User logged in successfully',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          userEmail: existingUser.userEmail,
        },
      });
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

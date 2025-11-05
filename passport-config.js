const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const usersModel = require('./models/users'); // Update path as needed

passport.use(new LocalStrategy(
  {
    usernameField: 'name',
    passwordField: 'password',
  },
  async (name, password, done) => {
    console.log('name', name, 'password', password);
    try {
      const user = await usersModel.get_by_name(name);
      console.log('username found', user);

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const match = await bcrypt.compare(password, user.user_password);

      console.log('password match', match);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

// This part is crucial for making the configuration available
module.exports = passport;

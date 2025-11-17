const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const usersModel = require('./models/users'); // Update path as needed

passport.serializeUser((user, done) => {
  // store the user id in the session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersModel.get_by_id(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(
  {
    usernameField: 'name',
    passwordField: 'password',
  },
  async (name, password, done) => {
    try {
      const user = await usersModel.get_by_name(name);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const match = await bcrypt.compare(password, user.userPassword);

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

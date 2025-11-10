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

      // knex-stringcase may transform column names, try both
      const userPassword = user.user_password || user.userPassword;
      
      if (!userPassword) {
        return done(new Error('User password not found'));
      }

      const match = await bcrypt.compare(password, userPassword);

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

passport.serializeUser((user, done) => {
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

module.exports = passport;
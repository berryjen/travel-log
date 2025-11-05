const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
// api routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const countriesRouter = require('./routes/countries');
const authenticationRouter = require('./routes/authentication');
const visitsRouter = require('./routes/visits');
const tokensRouter = require('./routes/tokens');

// routes views
const tokensModels = require('./models/tokens');

require('./passport-config');

const app = express();

passport.use(
  new BearerStrategy(async (token, done) => {
    const user = await tokensModels.get_user_by_token(token);
    if (user === undefined) {
      // console.log('invalid id', user);
      const err = new Error('Inavlid token');
      err.status = 401;
      return done(err);
    }
    // console.log('valid id', user);
    return done(null, token, { scope: 'all', user_id: user.user_id });
  }),
);

app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiPrefix = '/api';
app.use(`${apiPrefix}/`, indexRouter);
app.use(`${apiPrefix}/users`, usersRouter);
app.use(`${apiPrefix}/countries`, countriesRouter);
app.use(`${apiPrefix}/visits`, visitsRouter);
app.use(`${apiPrefix}/tokens`, tokensRouter);
app.use(`${apiPrefix}/authentication`, authenticationRouter);

function errorHandler(err, req, res, next) {
  const data = {
    status: err.status || 500,
    message: err.message,
  };
  res.status(err.status || 500);
  res.json(data);
  next();
}

app.use(errorHandler);
module.exports = app;
// need to track if the bearer token is being passed to the backend from the front end

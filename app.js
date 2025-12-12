const session = require('express-session');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
// api routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const countriesRouter = require('./routes/countries');
const authenticationRouter = require('./routes/authentication');
const visitsRouter = require('./routes/visits');
const tokensRouter = require('./routes/tokens');
const usersModel = require('./models/users');

// routes views
// const tokensModels = require('./models/tokens');

require('./passport-config');

const app = express();

app.use(session({
  // priate encrypted key to ensure that the coookie actually comes from the server
  secret: 'your_strong_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));

app.use(passport.initialize()); // <- initialises the authentication module https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
app.use(passport.session()); // <- https://www.passportjs.org/concepts/authentication/sessions/

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

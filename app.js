const session = require('express-session');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
// api routes
// eslint-disable-next-line import/no-extraneous-dependencies
const { ConnectSessionKnexStore } = require('connect-session-knex');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const countriesRouter = require('./routes/countries');
const authenticationRouter = require('./routes/authentication');
const visitsRouter = require('./routes/visits');
const tokensRouter = require('./routes/tokens');
const usersModel = require('./models/users');
const db = require('./db/db');

// routes views
// const tokensModels = require('./models/tokens');

require('./passport-config');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// cookieParser MUST come BEFORE session
app.use(cookieParser());
app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware - requires cookies to be already parsed
app.use(session({
  // priate encrypted key to ensure that the coookie actually comes from the server
  secret: 'your_strong_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
    domain: 'localhost', // Explicitly set domain to localhost
  },
  store: new ConnectSessionKnexStore({
    knex: db,
    tablename: 'sessions',
    createTable: true, // automatically create the sessions table
    clearInterval: 60 * 60 * 1000, // 1 hour
  }),
}));

// Passport middleware must come after session
app.use(passport.initialize()); // <- initialises the authentication module https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
app.use(passport.session()); // <- https://www.passportjs.org/concepts/authentication/sessions/
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

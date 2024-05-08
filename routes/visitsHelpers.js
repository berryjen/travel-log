const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const tokensModels = require('../models/tokens');
const countriesModel = require('../models/countries');
const usersModel = require('../models/users');
const visitsModel = require('../models/visits');

const router = express.Router();

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

const newVisits = async (req, res) => {
  console.log(req.query.access_token, 'access_token');
  if (!req.query.access_token) {
    return res.sendStatus(400);
  }

  const allCountries = await countriesModel.get_all();
  const countryNames = allCountries.map((country) => country.name);

  const user = await usersModel.get_by_token(req.query.access_token);
  const visits = await visitsModel.get_by_user_id(user.id);
  console.log(visits);
  return res.json({ countryNames, visits });
};

router.get(
  '/view-visit',
  passport.authenticate('bearer', { session: false }),
  async (req, res) => {
    // console.log(req, 'view-visit');
    const user = await usersModel.get_by_token(req.query.access_token);
    const visit = await visitsModel.get_by_id(req.query.visit_id, user.id);
    console.log('user:', user);
    console.log('visit:', visit);
    res.render('view-visit', {
      token: req.query.access_token,
      userId: user.id,
      name: user.name,
      visit,
    });
  },
);

module.exports = { newVisits };

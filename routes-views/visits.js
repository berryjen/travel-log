const express = require('express');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const tokensModels = require('../models/tokens');
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

module.exports = router;

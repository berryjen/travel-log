const db = require('../db/db');
const visitsModel = require('../models/visits');

exports.list = async (req, res) => {
  console.log('visits controller', req.authInfo, req.user);
  // visits controller undefined(req.authInfo) -> req.user.id { id: 1, name: 'jen' }
  const visits = await visitsModel.get_all(req.user.id);
  console.log('visits controller response', res.body);
  return res.json(visits);
};

exports.get = async (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  const visit = await visitsModel.get_by_id(parsedId, req.user.id);
  return res.json(visit);
};

exports.create = async (req, res) => {
  console.log('visits.create req', req.body);
  console.log('visits.create res', res.body);
  try {
    // TODO: figure out a way to check that id isn't contained in body at all
    if (req.body.id !== undefined) {
      return res.status(400).send('Bad Reqest, should not include id');
    }
    // TODO: check userID in req matches the userID in the token
    if (Number(req.body.user_id) !== req.authInfo.user_id) {
      console.log(
        req.body.name,
        req.query.user_email,
        req.body.user_password,
        req.authInfo.user_password,
      );
      return res.status(401).send('Unauthorized, user_password does not match');
    }
    const country = await db('countries').where({ id: req.body.country_id });
    const visit = await visitsModel.create(
      req.authInfo.user_id,
      country[0].id,
      req.body.arrival_time,
      req.body.departure_time,
    );
    return res.status(201).json(visit);
  } catch (err) {
    if (err instanceof visitsModel.ConstraintIdNullError) {
      err.status = 400;
    } else {
      console.log('unable to create visit:', err);
      err.message = 'unable to create visit';
    }
    throw err;
  }
};

exports.delete = async (req, res) => {
  const deletedVisit = await visitsModel.delete_by_id(req.params.id);
  if (deletedVisit === 0) {
    return res.sendStatus(404);
  }
  return res.sendStatus(204);
};

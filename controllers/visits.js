const db = require('../db/db');
const visitsModel = require('../models/visits');

exports.list = async (req, res) => {
  const visits = await visitsModel.get_all(req.user.id);
  return res.json(visits);
};

exports.get = async (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  const visit = await visitsModel.get_by_id(parsedId, req.user.id);
  console.log('visit from get req controller', visit);
  return res.json(visit);
};

exports.create = async (req, res) => {
  console.log('visits controller create timestamp', new Date().toISOString());
  console.log('visits.create req', req.body);
  console.log('visits controller req', req.user, req.session.user);
  console.log('visits.create res', res.body);
  if (!req.user) {
    console.log('req user', req.user);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    console.log(
      'visits controller create req info:',
      req.body.name,
      req.query.userEmail,
      typeof req.body.userId,
      req.body,
    );
    // TODO: figure out a way to check that id isn't contained in body at all
    if (req.body.id !== undefined) {
      console.log('req.body.id from create visit controller', req.body.id);
      return res.status(400).send('Bad Reqest, should not include id');
    }

    const country = await db('countries').where({ id: req.body.country_id });
    const visit = await visitsModel.create(
      req.user.id,
      country[0].id,
      req.body.arrival_time,
      req.body.departure_time,
    );
    console.log('visits Model create', visit);
    return res.status(201).json({ message: 'visit created successfully' });
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

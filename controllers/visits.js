/* eslint-disable consistent-return */
const db = require('../db/db');
const visitsModel = require('../models/visits');

const normalizeVisitBody = (body) => ({
  country_id: body.country_id ?? body.countryId,
  arrival_time: body.arrival_time ?? body.arrivalTime,
  departure_time: body.departure_time ?? body.departureTime,
});

exports.list = async (req, res, next) => {
  try {
    const visits = await visitsModel.get_all(req.user.id);
    return res.json(visits);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const parsedId = parseInt(req.params.id, 10);
    const visit = await visitsModel.get_by_id(parsedId, req.user.id);
    return res.json(visit);
  } catch (err) {
    if (err instanceof visitsModel.NotFoundError) {
      return res.sendStatus(404);
    }
    next(err);
  }
};

exports.create = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const body = normalizeVisitBody(req.body);
    if (req.body.id !== undefined) {
      return res.status(400).json({ message: 'Bad Reqest, should not include id' });
    }
    if (body.country_id == null) {
      return res.status(400).json({ message: 'countryId is required' });
    }

    const country = await db('countries').where({ id: body.country_id }).first();
    if (!country) {
      return res.status(400).json({ message: 'Invalid country' });
    }
    const visit = await visitsModel.create(
      req.user.id,
      country.id,
      req.body.arrival_time,
      req.body.departure_time,
    );
    return res.status(201).json(visit);
  } catch (err) {
    if (err instanceof visitsModel.ConstraintIdNullError) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deletedVisit = await visitsModel.delete_by_id(req.params.id);
    if (deletedVisit === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const db = require('../db/db');
/* eslint max-classes-per-file: ["error", 2] */

class ConstraintIdNullError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConstraintIdNullError';
  }
}
exports.ConstraintIdNullError = ConstraintIdNullError;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.name = 'NotFoundError';
  }
}
exports.NotFoundError = NotFoundError;

// get_all returns all the visits from the DB.
exports.get_all = async (userId) => {
  const visits = await db('visits')
    .join('countries', 'visits.country_id', '=', 'countries.id')
    .select(['visits.id', 'user_id', 'country_id', 'name'])
    .where({ 'visits.user_id': userId });

  return visits.map((v) => ({
    id: v.id,
    user: { id: v.userId },
    country: { id: v.countryId, name: v.name },
  }));
};

// get_by_id returns all info regarding a single visit
exports.get_by_id = async (id, userId) => {
  const visit = await db('visits')
    .join('countries', 'visits.country_id', '=', 'countries.id')
    .where({ 'visits.id': id, 'visits.user_id': userId })
    .first();
  if (!visit) {
    throw new NotFoundError('visit not found');
  }

  return {
    id: visit.id,
    user: { id: visit.userId },
    country: { id: visit.countryId, name: visit.name },
    arrival_time: visit.arrival_time,
    departure_time: visit.departure_time,
  };
};

// retrieves all visits via userId
exports.get_by_user_id = async (userId) => {
  const visits = await db('visits')
    .join('countries', 'countries.id', 'visits.country_id')
    .select('countries.name', 'visits.id')
    .where({ user_id: userId });
  return visits;
};

// creates & saves a new visit in SQLite DB
exports.create = async (userId, countryId, arrivalTime, departureTime) => {
  try {
    const at = new Date(arrivalTime);
    const dt = new Date(departureTime);

    if (Number.isNaN(at.getTime()) || Number.isNaN(dt.getTime())) {
      throw new Error('Invalid date format');
    }

    // SQLite insert returns the row id as an array [id]
    const result = await db('visits').insert(
      {
        user_id: userId,
        country_id: countryId,
        arrival_time: at.toISOString(),
        departure_time: dt.toISOString(),
      },
    );
    const visitId = Array.isArray(result) ? result[0] : result;

    // fetch the created row we return complete, correct data
    const visit = await db('visits').where({ id: visitId }).first();

    return {
      id: visit.id,
      userId: visit.user_id,
      countryId: visit.country_id,
      arrivalTime: visit.arrival_time,
      departureTime: visit.departure_time,
    };
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      throw new ConstraintIdNullError(
        `visit can't be created due to null user or country ID; userId='${userId}'; countryId='${countryId}'`,
      );
    }
    throw err;
  }
};

exports.delete_by_id = async (id) => {
  const deletedVisit = await db('visits').where({ id }).del();
  return deletedVisit;
};

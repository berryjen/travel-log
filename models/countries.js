const console = require('console');
const db = require('../db/db');

class CountryExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CountryExistsError';
  }
}
exports.CountryExistsError = CountryExistsError;

// get_all returns all the countries from the data store.
exports.get_all = async () => {
  const countries = await db('countries').select(['id', 'name']).orderBy('id');
  return countries;
};

// get_by_id finds and returns a country based on country.id.
exports.get_by_id = async (id) => {
  const country = await db('countries').where({ id }).first(['id', 'name']);
  return country;
};

// get_by_name finds and returns a country based on country.name.
// It looks for an exact match on country name.
exports.get_by_name = async (name) => {
  console.log(name);
  const country = await db('countries').where({ name }).first(['id', 'name']);
  return country;
};

// get_all_case_insensitive finds and returns all countries based on country.name
// it's case-insensitive
exports.get_all_case_insensitive = async (query) => {
  const countries = await db('countries').where('name', 'like', `%${query}%`);
  return countries;
};

// create saves a new country in the data store.
exports.create = async (name) => {
  try {
    const inserted = await db('countries').returning('id').insert({ name });
    const country = { id: inserted[0].id, name };
    return country;
  } catch (err) {
    console.log(err);
    if (err.code === 'SQLITE_CONSTRAINT') {
      throw new CountryExistsError(`country '${name}' already exists`);
    } else {
      throw new Error('unable to create country');
    }
  }
};

// delete erases a country in the data store
exports.delete_by_id = async (id) => {
  const numberOfDeletedCountry = await db('countries').where({ id }).del();
  return numberOfDeletedCountry;
};

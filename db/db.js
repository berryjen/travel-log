const knex = require('knex');
const config = require('../knexfile');

let db = null;
if (process.env.NODE_ENV === 'test') {
  db = knex(config.test);
} else if (process.env.NODE_ENV === 'production') {
  db = knex(config.production);
} else {
  db = knex(config.development);
}

module.exports = db;

const Knex = require('knex');
const knexStringcase = require('knex-stringcase').default;

console.log(knexStringcase);
const config = require('../knexfile');

let knexConfig = null;
if (process.env.NODE_ENV === 'test') {
  knexConfig = config.test;
} else if (process.env.NODE_ENV === 'production') {
  knexConfig = config.production;
} else {
  knexConfig = config.development;
}
const knexConfigWithStringCase = knexStringcase();
console.log(knexConfigWithStringCase);
const newConfig = { ...knexConfig, ...knexConfigWithStringCase };
console.log(newConfig);
const db = Knex(newConfig);

module.exports = db;

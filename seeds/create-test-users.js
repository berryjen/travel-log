const bcrypt = require('bcryptjs');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      id: 1,
      name: 'jen',
      user_email: 'jen@hotmail.com',
      user_password: await bcrypt.hash('123321', 10),
    },
    {
      id: 2,
      name: 'bill',
      user_email: 'bill@hotmail.com',
      user_password: await bcrypt.hash('234432', 10),
    },
  ]);
};

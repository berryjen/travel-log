/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcryptjs');

exports.seed = async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  const hashedPassword1 = await bcrypt.hash('123321', 10);
  const hashedPassword2 = await bcrypt.hash('234432', 10);

  await knex('users').insert([
    {
      id: 1,
      name: 'jen',
      email: 'jen@hotmail.com',
      password: hashedPassword1,
    },
    {
      id: 2,
      name: 'bill',
      email: 'bill@hotmail.com',
      password: hashedPassword2,
    },
  ]);
};

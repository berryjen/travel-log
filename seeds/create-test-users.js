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
      user_password: '123321',
    },
    {
      id: 2,
      name: 'bill',
      user_email: 'bill@hotmail.com',
      user_password: '234432',
    },
  ]);
};

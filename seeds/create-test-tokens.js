/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function seed(knex) {
  // deletes all existing tokens
  await knex('tokens').del();
  await knex('tokens').insert([
    { user_id: 1, bearer_token: 'DEF456' },
    { user_id: 2, bearer_token: 'ABC123' },
  ]);
};

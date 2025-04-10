/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    { id: 1, name: 'jen' },
    { id: 2, name: 'bill' },
  ]);
};

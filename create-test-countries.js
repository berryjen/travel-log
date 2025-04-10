/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
  // Deletes ALL existing entries
  await knex('countries').del();
  await knex('countries').insert([
    { id: 1, name: 'Canada' },
    { id: 2, name: 'United Kingdom' },
    { id: 3, name: 'Croatia' },
  ]);
};

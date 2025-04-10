/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable().unique();
  });

  return knex('users').insert([
    { name: 'Jen' },
    { name: 'Bill' },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
  return knex.schema.dropTable('users');
};

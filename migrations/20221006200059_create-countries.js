/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('countries', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable().unique().index();
  });

  return knex('countries').insert([
    { name: 'Canada' },
    { name: 'Croatia' },
    { name: 'Spain' },
    { name: 'Italy' },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
  return knex.schema
    .dropTable('countries');
};

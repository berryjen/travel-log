/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  return knex.schema.createTable('visits', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.integer('country_id').notNullable().index();
    table.dateTime('arrival_time');
    table.dateTime('departure_time');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
  return knex.schema
    .dropTable('visits');
};

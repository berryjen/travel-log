/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('tokens', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.string('bearer_token').notNullable().unique();
  });
  return knex('tokens').insert([
    { user_id: 1, bearer_token: 'ABC123' },
    { user_id: 2, bearer_token: 'DEF456' },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('tokens');
};

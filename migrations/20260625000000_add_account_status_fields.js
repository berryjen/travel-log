/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.text('account_status').notNullable().defaultTo('active');
    table.text('deactivated_at').defaultTo(null);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('account_status');
    table.dropColumn('deactivated_at');
  });
};

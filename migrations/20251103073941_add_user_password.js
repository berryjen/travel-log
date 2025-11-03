/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('user_password', 128);
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS users_user_email_unique');
  return knex.schema.table('users', (table) => {
    table.dropColumn('user_password');
  });
};

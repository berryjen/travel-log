/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('user_name', 128).notNullable.unique();
    table.string('user_email', 128).notNullable.unique();
    table.string('user_password', 128).notNullable().unique();
  });
  return knex('users').insert([
    { user_name: 'jen', user_email: 'jen@hotmail.com' },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('user_name');
    table.dropColumn('user_email');
    table.dropColumn('user_password');
  });
};

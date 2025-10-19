/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
//   await knex.raw('Drop index if exists users_user_email_unique');
  await knex.schema.alterTable('users', (table) => {
    table.string('user_email', 128).notNullable().unique().alter();
  });
  const hasUserEmail = await knex.schema.hasColumn('users', 'user_email');
  if (hasUserEmail) {
    await knex.raw(
      'CREATE UNIQUE INDEX IF NOT EXISTS users_user_email_unique ON users (user_email)',
    );
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS users_user_email_unique');
};

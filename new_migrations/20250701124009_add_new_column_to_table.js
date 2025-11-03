/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('user_email', 128);
    table.string('user_password', 128);
  });
  const usersToUpdate = await knex('users').select('id', 'name').whereNull('user_email');
  console.log('usersToUpdate', usersToUpdate);
  await Promise.all(
    usersToUpdate.map((user) => {
      console.log('user', user);
      return knex('users')
        .where('id', user.id)
        .update({
          user_email: `user_${user.name}@hotmail.com`,
        });
    }),
  );
  await knex.schema.alterTable('users', (table) => {
    table.string('user_email', 128).notNullable().alter();
  });
  await knex.raw('CREATE UNIQUE INDEX IF NOT EXISTS users_user_email_unique ON users (user_email)');
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS users_user_email_unique');
  return knex.schema.table('users', (table) => {
    table.dropColumn('user_email');
    table.dropColumn('user_password');
  });
};

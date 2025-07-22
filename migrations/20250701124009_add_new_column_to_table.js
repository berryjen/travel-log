/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('user_name', 128);
    table.string('user_email', 128);
    table.string('user_password', 128);
  });
  const usersToUpdate = await knex('users').select('id').whereNull('user_name');
  await Promise.all(
    usersToUpdate.map((user) => knex('users')
      .where('id', user.id)
      .update({
        user_name: `user_${user.name}`,
        user_email: `user_${user.name}@hotmail.com`,
      })),
  );
  await knex.schema.alterTable('users', (table) => {
    table.string('user_name', 128).notNullable().unique().alter();
    table.string('user_email', 128).notNullable().unique().alter();
  });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('user_name');
    table.dropColumn('user_email');
    table.dropColumn('user_password');
  });
}

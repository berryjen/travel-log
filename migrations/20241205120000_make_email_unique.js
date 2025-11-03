/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  // await knex.raw('Drop index if exists users_user_email_unique');

  // Define placeholder data for existing user
  const existingUserWithEmails = [
    { id: 1, user_email: 'jen@hotmail.com' },
    { id: 2, user_email: 'bill@hotmail.com' },
  ];

  // Add the column as NULLABLE first to avoid constraint errors on existing data.
  await knex.schema.alterTable('users', (table) => {
    // table.string('user_email', 128).nullable().unique();
    table.string('user_email', 128);
  });

  // Batch update existing rows with non-null values.
  await knex.transaction(async (transaction) => {
    const updatePromises = existingUserWithEmails.map((user) => transaction('users').where('id', user.id).update({ user_email: user.user_email }));

    await Promise.all(updatePromises);
  });

  // Alter the column to enforce the final NOT NULL constraint.
  await knex.schema.alterTable('users', (table) => {
    table.string('user_email', 128).notNullable().unique().alter();
  });

  // const hasUserEmail = await knex.schema.hasColumn('users', 'user_email');
  // if (hasUserEmail) {
  //   await knex.raw(
  //     'CREATE UNIQUE INDEX IF NOT EXISTS users_user_email_unique ON users (user_email)',
  //   );
  // }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  // await knex.raw('DROP INDEX IF EXISTS users_user_email_unique');
  await knex.schema.alterTable('users', (table) => {
    /*
      Warning: this will remove the user_email table - do not run this after this as
      it's a destructive operation.
    */
    table.dropUnique(['user_email']);
    table.dropColumn('user_email');
  });
};

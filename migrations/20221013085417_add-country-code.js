/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('countries', (table) => {
    table.string('country_code');
  });

  await knex('countries').where({ name: 'Canada' }).update({ country_code: 'ca' });
  await knex('countries').where({ name: 'Croatia' }).update({ country_code: 'hr' });
  await knex('countries').where({ name: 'Spain' }).update({ country_code: 'es' });
  return knex('countries').where({ name: 'Italy' }).update({ country_code: 'it' });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
  return knex.schema.alterTable('countries', (table) => {
    table.dropColumn('country_code');
  });
};

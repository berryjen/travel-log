/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cities', (table) => {
    table.increments('id').primary();
    table.integer('name').notNullable().index();
    table.integer('country_id').notNullable().index();
  });

  // TODO: lookup country_id rather than hard code it
  await knex('cities').insert({ name: 'Ontario', country_id: 1 });
  await knex('cities').insert({ name: 'Split', country_id: 2 });
  await knex('cities').insert({ name: 'Barcelona', country_id: 3 });
  return knex('cities').insert({ name: 'Rome', country_id: 4 });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
  return knex.schema
    .dropTable('cities');
};

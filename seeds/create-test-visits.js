/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
  await knex('visits').del();
  await knex('visits').insert([
    {
      id: 13, user_id: 1, country_id: 1, arrival_time: '2022-10-30T23:00:20.000Z', departure_time: '2022-10-30T23:00:00.000Z',
    },
    {
      id: 3, user_id: 2, country_id: 2, arrival_time: '2022-10-27T12:17:06.000Z', departure_time: '2022-10-27T12:17:06.000Z',
    },
  ]);
};

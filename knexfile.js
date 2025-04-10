// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: '/var/opt/travel-log/prod.sqlite3',
    },
    useNullAsDefault: true,
  },

};

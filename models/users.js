const db = require('../db/db');

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserExistsError';
  }
}
exports.UserExistsError = UserExistsError;

// get_all returns all the users from the data store.
exports.get_all = async () => {
  const users = await db('users').select(['id', 'name']);
  return users;
};

// get_by_token returns 1 user based on a token
// if invalid token, undefined
// if empty token, undefined
exports.get_by_token = async (token) => {
  const user = await db('users', 'tokens')
    .join('tokens', 'tokens.user_id', '=', 'users.id')
    .where({ 'tokens.bearer_token': token })
    .first(['users.id', 'users.name']);
  return user;
};
// get_by_id finds and returns a user based on user.id.
exports.get_by_id = async (id) => {
  const user = await db('users').where({ id }).first(['id', 'name']);
  return user;
};

// get_by_name finds and returns a user based on user.name
exports.get_by_name = async (name) => {
  const user = await db('users').where({ name }).first(['id', 'name']);
  return user;
}

// create saves a new user in the data store.
exports.create = async (name) => {
  try {
    const inserted = await db('users').returning('id').insert({ name });
    const user = { id: inserted[0].id, name };
    return user;
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      throw new UserExistsError(`user '${name}' already exists`);
    } else {
      throw new Error('unable to create user');
    }
  }
};

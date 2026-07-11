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
// get_by_id finds and returns a user based on user.id.
exports.get_by_id = async (id) => {
  const user = await db('users').where({ id }).first(['id', 'name', 'account_status', 'deactivated_at']);
  return user;
};

exports.get_by_email = async (userEmail) => {
  console.log('usersModel.get_by_email', userEmail);
  const user = await db('users').where({ user_email: userEmail }).first(['id', 'name', 'user_email', 'user_password']);
  console.log('user found by email', user);
  return user;
};
// get_by_name finds and returns a user based on user.name
exports.get_by_name = async (name) => {
  // TODO: you might not want to return the user_password
  const user = await db('users').where({ name }).first(['id', 'name', 'user_password', 'account_status']);
  return user;
};

// create saves a new user in the data store.
exports.create = async (name, userEmail, userPassword) => {
  try {
    const inserted = await db('users').returning('id').insert({ name, userEmail, userPassword });
    const user = {
      id: inserted[0].id, name, userEmail, userPassword,
    };
    return user;
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      throw new UserExistsError(`user '${name}' already exists`);
    } else {
      throw new Error('unable to create user');
    }
  }
};

// deactivate sets a user's account status to 'deactivated' and records the timestamp.
exports.deactivate = async (id) => {
  const now = new Date().toISOString();
  await db('users').where({ id }).update({
    account_status: 'deactivated',
    deactivated_at: now,
  });
  return { accountStatus: 'deactivated', deactivatedAt: now };
};

// reactivate restores a deactivated account back to active.
exports.reactivate = async (id) => {
  await db('users').where({ id }).update({
    account_status: 'active',
    deactivated_at: null,
  });
  return { accountStatus: 'active' };
};

// get_account_status returns the account status and deactivation timestamp for a user.
exports.get_account_status = async (id) => {
  const user = await db('users').where({ id }).first(['account_status', 'deactivated_at']);
  return user;
};

// delete_account permanently removes a user and all associated data in a transaction.
exports.delete_account = async (id) => {
  await db.transaction(async (trx) => {
    await trx('visits').where({ user_id: id }).del();
    await trx('sessions').where('sess', 'like', `%"passport":{"user":${id}}%`).del();
    await trx('users').where({ id }).del();
  });
};

// get_password_hash returns the hashed password for a user (used for delete confirmation).
exports.get_password_hash = async (id) => {
  const user = await db('users').where({ id }).first(['user_password']);
  return user ? user.userPassword : null;
};

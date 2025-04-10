const db = require('../db/db');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.name = 'NotFoundError';
  }
}
exports.NotFoundError = NotFoundError;
// returns all tokens from database
exports.get_all_tokens = async () => {
  const tokens = await db('tokens').select(['user_id', 'bearer_token']);
  return tokens;
};

// returns 1 token based on user_id
exports.get_token_by_user_id = async (userId) => {
  console.log(userId);
  const token = await db('tokens')
    .where({ 'tokens.user_id': userId })
    .first(['user_id', 'bearer_token']);
  return token;
};

exports.get_user_by_token = async (token) => {
  console.log(token);
  const userId = await db('tokens')
    .where({ 'tokens.bearer_token': token })
    .first(['bearer_token', 'user_id']);
  // if (userId === undefined) {
  //   throw new NotFoundError('invalid token');
  // }
  return userId;
};

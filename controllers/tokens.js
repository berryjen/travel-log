const tokensModel = require('../models/tokens');
const usersModel = require('../models/users');

exports.list = async (req, res) => {
  const tokens = await tokensModel.get_all_tokens();
  return res.json(tokens);
};

exports.get = async (req, res) => {
  const user = await usersModel.get_by_name(req.params.user_name);
  // this comes through as a request via user name, which is in request param
  const token = await tokensModel.get_token_by_user_id(user.id);
  // using the name the user provides, it goes into db to find matching id
  //  which is then used to fetch the token via the id from the tokens table
  return res.json(token);
};

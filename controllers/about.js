const usersModel = require('../models/users');

exports.list = async (req, res) => {
  const users = await usersModel.get_all();
  return res.json(users);
};

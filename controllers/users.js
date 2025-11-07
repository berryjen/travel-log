const bcrypt = require('bcryptjs');
const usersModel = require('../models/users');

exports.list = async (req, res) => {
  const users = await usersModel.get_all();
  return res.json(users);
};

exports.get = async (req, res) => {
  const user = await usersModel.get_by_id(req.params.id);
  return res.json(user);
};

exports.create = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    const user = await usersModel.create(req.body.name, hashedPassword);
    return res.status(201).json(user);
  } catch (err) {
    if (err instanceof usersModel.UserExistsError) {
      err.status = 400;
    } else {
      err.message = 'unable to create user';
    }
    next(err);
    return err;
  }
};

exports.login = async (req, res) => {
  return res.json({
    message: 'Login successful',
    user: req.user,
  });
}

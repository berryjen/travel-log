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
    const user = await usersModel.create(req.body.name, req.body.user_email, hashedPassword);
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

exports.login = async (req, res) => res.json({
  message: 'Login successful',
  user: req.user,
});

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

exports.deactivate = async (req, res) => {
  try {
    const result = await usersModel.deactivate(req.user.id);
    const deletionEligibleAt = new Date(
      new Date(result.deactivatedAt).getTime() + THIRTY_DAYS_MS,
    ).toISOString();

    // Destroy the session so the user is logged out
    req.logout((err) => {
      if (err) {
        console.error('Logout error during deactivation:', err);
      }
    });

    return res.status(200).json({
      message: 'Account deactivated. You can reactivate within 30 days or delete after.',
      deactivatedAt: result.deactivatedAt,
      deletionEligibleAt,
    });
  } catch (err) {
    console.error('Deactivation error:', err);
    return res.status(500).json({ error: 'Failed to deactivate account' });
  }
};

exports.reactivate = async (req, res) => {
  try {
    const status = await usersModel.get_account_status(req.user.id);
    if (!status || status.accountStatus !== 'deactivated') {
      return res.status(400).json({ error: 'Account is not deactivated' });
    }

    await usersModel.reactivate(req.user.id);
    return res.status(200).json({ message: 'Account reactivated successfully' });
  } catch (err) {
    console.error('Reactivation error:', err);
    return res.status(500).json({ error: 'Failed to reactivate account' });
  }
};

exports.getAccountStatus = async (req, res) => {
  try {
    const status = await usersModel.get_account_status(req.user.id);
    if (!status) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      status: status.accountStatus,
      deactivatedAt: status.deactivatedAt,
      deletionEligibleAt: null,
      canDelete: false,
    };

    if (status.accountStatus === 'deactivated' && status.deactivatedAt) {
      const deactivatedTime = new Date(status.deactivatedAt).getTime();
      const eligibleAt = deactivatedTime + THIRTY_DAYS_MS;
      response.deletionEligibleAt = new Date(eligibleAt).toISOString();
      response.canDelete = Date.now() >= eligibleAt;
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error('Get account status error:', err);
    return res.status(500).json({ error: 'Failed to get account status' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password, immediate } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // Verify the password
    const storedHash = await usersModel.get_password_hash(req.user.id);
    if (!storedHash) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, storedHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!immediate) {
      const status = await usersModel.get_account_status(req.user.id);
      if (!status || status.accountStatus !== 'deactivated') {
        return res.status(400).json({
          error: 'Account must be deactivated before deletion. Use immediate: true to skip the waiting period.',
        });
      }

      const deactivatedTime = new Date(status.deactivatedAt).getTime();
      const eligibleAt = deactivatedTime + THIRTY_DAYS_MS;
      if (Date.now() < eligibleAt) {
        return res.status(403).json({
          error: 'Account cannot be deleted yet. 30-day waiting period has not passed.',
          deletionEligibleAt: new Date(eligibleAt).toISOString(),
        });
      }
    }

    const userId = req.user.id;

    // Destroy the session before deleting
    req.logout((err) => {
      if (err) {
        console.error('Logout error during deletion:', err);
      }
    });

    await usersModel.delete_account(userId);

    return res.status(200).json({ message: 'Account and all associated data have been permanently deleted' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};

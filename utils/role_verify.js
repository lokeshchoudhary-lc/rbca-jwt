const User = require('../models/UserModel');
const createError = require('http-errors');

module.exports = {
  roleVerification: async (req, res, next) => {
    try {
      const { user_id } = req.payload;
      const user = await User.findById(user_id).lean().exec();

      if (req.originalUrl.includes('/user')) {
        if (user.role === 'user' || user.role === 'admin') {
          return next();
        } else {
          throw createError.Unauthorized('Role not allowed');
        }
      }
      if (req.originalUrl.includes('/admin')) {
        if (user.role === 'admin') {
          return next();
        } else {
          throw createError.Unauthorized('Role not allowed');
        }
      }
    } catch (error) {
      next(error);
    }
  },
};

const User = require('../../models/UserModel');
const createError = require('http-errors');

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      const { user_id } = req.payload;
      const user = await User.findById(user_id).lean().exec();
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
};

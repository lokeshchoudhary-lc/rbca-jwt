const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');

module.exports = {
  signup: async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const userCheck = await User.findOne({ email: req.body.email })
        .lean()
        .exec();

      if (!userCheck) {
        req.body.password = hashedPassword;
        const user = new User(req.body);
        await user.save();
      } else {
        throw createError.Conflict('Email Already Registered !');
      }

      res.status(200).json({ message: 'User Successfully Created' });
    } catch (error) {
      return next(error);
    }
  },
};

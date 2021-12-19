const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/UserModel');
const { signAccessToken, signRefreshToken } = require('../../utils/jwt_helper');

module.exports = {
  login: async (req, res, next) => {
    try {
      if (req.cookies.LoginState) {
        return next(createError.BadRequest('Already Logined !'));
      }

      const userCheck = await User.findOne({ email: req.body.email })
        .lean()
        .exec();

      if (!userCheck) {
        throw createError.NotFound('Email Not Registered !');
      }
      const { _id, password: hashedPassword, role } = userCheck;

      const isMatch = await bcrypt.compare(req.body.password, hashedPassword);

      if (!isMatch) {
        throw createError.Unauthorized('Invalid Email & Password!');
      }

      const accessToken = await signAccessToken(_id, role);
      const refreshToken = await signRefreshToken(_id, role);

      res.cookie('AccessTokenCookie', accessToken, {
        sameSite: 'strict',
        // secure: true, IN Https only
        httpOnly: true,
        maxAge: 900000, //15m
      });

      res.cookie('RefreshTokenCookie', refreshToken, {
        sameSite: 'strict',
        // secure: true, IN Https only
        httpOnly: true,
        maxAge: 604800000, //7d
      });

      res.cookie('LoginState', 1, {
        sameSite: 'none',
        secure: true,
        maxAge: 604800000, //7d
      });

      res.json('Successfull login');
    } catch (err) {
      return next(err);
    }
  },
};

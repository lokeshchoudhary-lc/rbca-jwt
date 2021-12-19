const User = require('../../models/UserModel');
const createError = require('http-errors');

module.exports = {
  getAllUser: async (req, res, next) => {
    try {
      const { searchTerm, role } = req.query;
      let page = parseInt(req.query.page);

      if (!page) {
        page = 1;
      }

      const size = 20; // results at a time
      const skip = (page - 1) * size;
      const filtersBody = {};

      if (searchTerm) {
        filtersBody.name = { $regex: `${searchTerm}` };
      }
      if (role) {
        filtersBody.role = role;
      }

      const user = await User.find(filtersBody)
        .limit(20)
        .skip(skip)
        .lean()
        .exec();
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw createError.BadRequest('No Parameter Provided');
      }
      await User.findByIdAndDelete(id).lean().exec();
      res.send('User Delete SuccessFully');
    } catch (error) {
      next(error);
    }
  },
  getOneUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw createError.BadRequest('No Parameter Provided');
      }
      const user = await User.findById(id).lean().exec();
      if (!user) {
        return res.status(404).send('No Data Found');
      }
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw createError.BadRequest('No Parameter Provided');
      }
      if (!req.body) {
        throw createError.BadRequest('No Body Provided');
      }
      const user = await User.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        lean: true,
        runValidators: true,
      })
        .lean()
        .exec();
      if (!user) {
        return res.status(404).send('No Data Found');
      }
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
};

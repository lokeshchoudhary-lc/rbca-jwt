const Route = require('express').Router();

const {
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
} = require('../../controllers/Admin_Controllers/admin.controller');

Route.get('/', getAllUser);
Route.get('/:id', getOneUser);
Route.delete('/:id', deleteUser);
Route.put('/:id', updateUser);

module.exports = Route;

const Route = require('express').Router();

const {
  getProfile,
} = require('../../controllers/User_Controllers/user.controller');

Route.get('/', getProfile);

module.exports = Route;

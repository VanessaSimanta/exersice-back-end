const joi = require('joi');
const { patchUser } = require('./users-service');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      password_confirm: joi.string().min(6).max(32).required().label('Confirm Password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  patchUser: {
    body: {
      password_lama: joi.string().min(6).max(32).required().label('Password Lama'),
      password_baru: joi.string().min(6).max(32).required().label('Password Baru'),
      password_confirm: joi.string().min(6).max(32).required().label('Confirm Password'),
    },
  },
};

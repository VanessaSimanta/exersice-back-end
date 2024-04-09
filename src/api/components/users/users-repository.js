const passport = require('passport');
const { User } = require('../../../models');
const { password } = require('../../../models/users-schema');
const { passwordMatched } = require('../../../utils/password');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */

//check adanya duplicated email
async function checkDuplicateEmail(email) {
  const data = await User.find({ email: email });
  if (data.length > 0) {
    return true;
  }
  return false;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

//cek password matched or not
async function diffrentPass(password_lama) {
  const pass = await passwordMatched(password_lama, User.password);
  if (pass.length > 0) {
    return false;
  }
  return true;
}
//untuk update password dengan password baru
async function patchUser(id, password_lama, password_baru, password_confirm) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        password: password_baru,
      },
    }
  );
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkDuplicateEmail,
  patchUser,
  diffrentPass,
};

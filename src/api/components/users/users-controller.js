const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;
  
    //make sure confirm password dengan password yang di input sama
    //kalo ga sama throw error
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'different password'
      );
    }

    //duplicate email
    const isDuplicate = await usersService.duplicateEmail(email);
    if (isDuplicate) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Failed to create user'
      );
    }

    //create user
    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }
    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;
    const isDuplicate = await usersService.duplicateEmail(email);
    if (isDuplicate) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Failed to update user'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

//function untuk patch user
async function patchUser(request, response, next) {
  try {
    const id = request.params.id;
    const password_lama = request.body.password_lama;
    const password_baru = request.body.password_baru;
    const password_confirm = request.body.password_confirm;
    const isDiffrent = await usersService.diffrentPass(password_lama);
    //kalo password lama beda sama yang di database throw error
    if (isDiffrent) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        '"password lama" is diffrent'
      );
    }

    //password baru sama password confirm harus sama atau ga throw error
    if (password_confirm!== password_baru) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'different password'
      );
    }

    //untuk pacth password
    const success = await usersService.patchUser(id, password_lama, password_baru, password_confirm);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update password'
      );
    }
  
    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
};

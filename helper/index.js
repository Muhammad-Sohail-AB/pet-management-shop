const createTokenUser = require('./createTokenUser');
const createJWT = require('./createJWT');
const checkPermissions = require('./checkPermissions');
const authorizedPermissions = require('./authorizedPermissions');
const updateDocument = require('./updateDocument');

module.exports = {
  createTokenUser,
  createJWT,
  checkPermissions,
  authorizedPermissions,
  updateDocument,
};

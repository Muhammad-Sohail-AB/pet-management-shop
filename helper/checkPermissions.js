const CustomApiError = require('../errors');

const checkPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomApiError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};
module.exports = checkPermissions;

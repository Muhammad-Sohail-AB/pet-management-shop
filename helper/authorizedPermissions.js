const CustomAPIError = require('../errors');

const authorizedPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userID === resourceUserId.toString()) return;
  throw new CustomAPIError.UnauthorizedError(
    'Not authorized to access this route'
  );
};
module.exports = authorizedPermissions;

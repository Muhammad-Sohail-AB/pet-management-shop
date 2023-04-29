const CustomError = require('../errors');
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userID: payload.userID,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError('Authentication Invalid');
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};

const jwt = require('jsonwebtoken');
const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE,
  });
};
module.exports = createJWT;

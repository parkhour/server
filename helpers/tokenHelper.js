const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createAccessToken,
  verifyAccessToken,
};

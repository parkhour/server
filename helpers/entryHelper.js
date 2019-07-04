const bcrypt = require('bcryptjs');

const hashPassword = (inputPassword) => {
  return bcrypt.hashSync(inputPassword, 8);
};

module.exports = {
  hashPassword,
};


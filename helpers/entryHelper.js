const bcrypt = require('bcryptjs');

const hashPassword = (inputPassword) => {
  return bcrypt.hashSync(inputPassword, 8);
};

// const verifyPassword = (candidatePassword, hash) => {
//   return bcrypt.compareSync(candidatePassword, hash);
// };

module.exports = {
  hashPassword,
  // verifyPassword,
};


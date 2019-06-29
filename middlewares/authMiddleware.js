const User = require('../models/User');
const { verifyAccessToken } = require('../helpers/tokenHelper');

const userAuthentication = (req, res, next) => {
  if(req.headers.hasOwnProperty('authorization')) {
    const decode = verifyAccessToken(req.headers.authorization);
    
    User.findOne({email: decode.email})
      .then((user) => {
        if(user) {
          req.authenticated = decode;
          return next();
        } else {
          throw new Error('User not found');
        };
      })
      .catch(next)
  } else {
    res.status(401).json({ message: 'Unauthenticated request' });
  };
};

// const userAuthorization = (req, res, next) => {
//   const { uid } = req.authenticated;


// };

module.exports = {
  userAuthentication,
  // userAuthorization,
};

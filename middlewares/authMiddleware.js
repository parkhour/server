const User = require('../models/User');
const { verifyAccessToken } = require('../helpers/tokenHelper');

const userAuthentication = (req, res, next) => {
  if(req.headers.hasOwnProperty('authorization')) {
    const decode = verifyAccessToken(req.headers.authorization);
    
    User.findOne({email: decode.email})
      .then((user) => {
        if(user) {
          req.authenticated = decode;
          next();
        }
      })
      .catch(next)
  } else {
    res.status(401).json({ message: 'Unauthenticated request' });
  };
};

const adminAuthentication = (req, res, next) => {
  if(req.headers.hasOwnProperty('authorization')) {
    const decode = verifyAccessToken(req.headers.authorization);

    User.findOne({ role: decode.role })
      .then((user) => {
        if(user && user.role === 'admin') {
          req.authenticated = decode;
          return next();
        } else {
          throw new Error('Unauthorized request')
        }
      })
      .catch(next)
  } else {
    res.status(401).json({ message: 'Bad request, please login again' });
  }
}
// const userAuthorization = (req, res, next) => {
//   const { uid } = req.authenticated;


// };

module.exports = {
  userAuthentication,
  adminAuthentication,
  // userAuthorization,
};

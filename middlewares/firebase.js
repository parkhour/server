const { auth } = require('../config/firebase');

exports.firebaseAuth = (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if(email === '' || password === '') {
    throw new Error("Email/password cannot be empty");
  };

  const { originalUrl } = req;
  const cmd = originalUrl === '/login' ? 'signInWithEmailAndPassword' : 'createUserWithEmailAndPassword';
  
  auth[cmd](email, password)
    .then((user) => {
      req.uid = user.uid;
      return next();
    })
    .catch(next);
}

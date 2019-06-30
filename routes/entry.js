const express = require('express');

const { 
  firebaseAuth,
  firebaseSignOut
 } = require('../middlewares/firebaseMiddleware');

const {
  getTestErrorRoute,
  postUserLogin,
  postUserRegister,
  postUserLogout,
} = require('../controllers/entry');

const router = express.Router();

router.post('/register', firebaseAuth, postUserRegister);
router.post('/login', firebaseAuth, postUserLogin);
router.post('/logout', firebaseSignOut, postUserLogout);
router.get('/test', getTestErrorRoute);

module.exports = router;

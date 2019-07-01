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
  postCreateTestAdmin
} = require('../controllers/entry');

const router = express.Router();

router.post('/register', firebaseAuth, postUserRegister);
router.post('/admin-reg', firebaseAuth, postCreateTestAdmin);
router.post('/login', firebaseAuth, postUserLogin);
router.post('/logout', firebaseSignOut, postUserLogout);
router.get('/test', getTestErrorRoute);

module.exports = router;

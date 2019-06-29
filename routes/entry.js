const express = require('express');
const controller = require('../controllers/entry');
const { firebaseAuth } = require('../middlewares/firebase');

const {
  postUserLogin,
  postUserRegister,
} = controller;

const router = express.Router();

router.post('/register', firebaseAuth, postUserRegister);
router.post('/login', firebaseAuth, postUserLogin);

module.exports = router;

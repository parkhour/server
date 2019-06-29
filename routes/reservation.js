const express = require('express');
const controller = require('../controllers/reservation');

const {
  postCreateReservation,
} = controller;

const { userAuthentication } = require('../middlewares/authMiddleware');
const { firebaseCreateReservation } = require('../middlewares/firebaseMiddleware');

const router = express.Router();

router.post('/', userAuthentication, postCreateReservation, firebaseCreateReservation);

module.exports = router;
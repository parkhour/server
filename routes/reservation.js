const express = require('express');
const controller = require('../controllers/reservation');

const {
  postCreateReservation,
  getAllReservations,
} = controller;

const { userAuthentication } = require('../middlewares/authMiddleware');
const { firebaseCreateReservation } = require('../middlewares/firebaseMiddleware');

const router = express.Router();

router.post('/', userAuthentication, postCreateReservation, firebaseCreateReservation);
router.get('/', userAuthentication, getAllReservations);

module.exports = router;
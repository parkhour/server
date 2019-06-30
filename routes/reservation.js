const express = require('express');

const {
  postCreateReservation,
  getAllReservations,
} = require('../controllers/reservation');

const { userAuthentication } = require('../middlewares/authMiddleware');
const { firebaseCreateReservation } = require('../middlewares/firebaseMiddleware');

const router = express.Router();

router.post('/', userAuthentication, postCreateReservation, firebaseCreateReservation);
router.get('/', userAuthentication, getAllReservations);

module.exports = router;
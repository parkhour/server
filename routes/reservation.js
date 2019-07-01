const express = require('express');

const {
  postCreateReservation,
  getAllReservations,
} = require('../controllers/reservation');

const { userAuthentication } = require('../middlewares/authMiddleware');
const { 
  firebaseCreateReservation,
  firebaseGetReservationsData,
 } = require('../middlewares/firebaseMiddleware');

const router = express.Router();

router.post('/', userAuthentication, postCreateReservation, firebaseCreateReservation);
router.get('/', userAuthentication, firebaseGetReservationsData, getAllReservations);
// router.get('/', firebaseGetReservationsData, getAllReservations);

module.exports = router;
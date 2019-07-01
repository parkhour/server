const express = require('express');
const { errorHandler } = require('../middlewares/errorhandler');
const router = express.Router();

const entryRoute = require('./entry');
const reservationRoute = require('./reservation');
const paymentRoute = require('./payment');

router.use('/', entryRoute);
router.use('/reservations', reservationRoute);
router.use('/payments', paymentRoute);

router.use(errorHandler);

module.exports = router;
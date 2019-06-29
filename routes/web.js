const express = require('express');
const { errorHandler } = require('../middlewares/errorhandler');
const entryRoute = require('./entry');
const router = express.Router();

router.use('/', entryRoute);
router.use(errorHandler);

module.exports = router;
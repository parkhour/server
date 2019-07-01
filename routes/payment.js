const express = require('express');
const { adminAuthentication } = require('../middlewares/authMiddleware');

const { 
  postCreatePayment,
  getAllPayments
} = require('../controllers/payment');

const router = express.Router();

router.post('/', adminAuthentication, postCreatePayment);
router.get('/', adminAuthentication, getAllPayments);

module.exports = router;

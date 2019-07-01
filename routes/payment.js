const express = require('express');
const { adminAuthentication } = require('../middlewares/authMiddleware');

const { 
  postCreatePayment,
  getAllPayments,
  patchEditPaymentById,
} = require('../controllers/payment');

const router = express.Router();

router.post('/', adminAuthentication, postCreatePayment);
router.get('/', adminAuthentication, getAllPayments);
router.patch('/:id', adminAuthentication, patchEditPaymentById);

module.exports = router;

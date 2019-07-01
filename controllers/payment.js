const Payment = require('../models/Payment');

class PaymentController {
  static postCreatePayment (req, res, next) {
    const { licensePlate } = req.body;

    const newPayment = new Payment({
      licensePlate,
    });

    newPayment.save()
      .then((payment) => {
        res.status(201).json(payment)
      })
      .catch(next);
  };

  static getAllPayments (req, res, next){
    Payment.find({})
      .then((payments) => {
        res.status(200).json(payments)
      })
      .catch(next);
  };
  
};

module.exports = PaymentController;

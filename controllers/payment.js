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

  static getAllPayments (req, res, next) {
    Payment.find({})
      .then((payments) => {
        res.status(200).json(payments)
      })
      .catch(next);
  };

  static patchEditPaymentById(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    Payment.findOneAndUpdate({ _id: id}, { status }, {new: true })
      .then((payment) => {
        res.status(200).json(payment)
      })
      .catch(next);
  }
  
};

module.exports = PaymentController;

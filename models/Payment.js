const mongoose = require('mongoose');
const Reservation = require('./Reservation');
const { calculateParkingCharge } = require('../helpers/timeHelper');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  mallId: String,
  parkId: Number,
  reservationId: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
  },
  licensePlate: String,
  parkingStart: Date,
  parkingEnd: Date,
  totalCharge: String,
});

paymentSchema.pre('save', function(next) {
  Reservation.findOne({ licensePlate: this.licensePlate })
    .then((reservation) => {
      if(!reservation) {
        throw new Error('Reservation not found');
      }
      this.mallId = reservation.mallId;
      this.parkId = reservation.parkId;
      this.reservationId = reservation._id;
      this.parkingStart = reservation.createdAt;
      this.parkingEnd = new Date();
      this.totalCharge = calculateParkingCharge(reservation.createdAt);
      next();
    })
    .catch(next);
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

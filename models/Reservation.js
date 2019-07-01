const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  mallId: String,
  parkId: Number,
  mallName: String,
  uid: String,
  licensePlate: {
    type: String,
    required: [true, 'License plate cannot be empty'],
  },
  status: {
    type: String,
    default: 'waiting'
  },
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

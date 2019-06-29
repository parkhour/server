const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  mallId: String,
  parkId: Number,
  uid: String,
  status: {
    type: String,
    default: 'waiting'
  },
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

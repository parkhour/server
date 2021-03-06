const Reservation = require('../models/Reservation');

class ReservationController {

  static postCreateReservation(req, res, next) {
    const { 
      parkId,
      mallId,
      licensePlate,
      mallName
    } = req.body;
    const { id } = req.authenticated;
    
    const newReservation = new Reservation({
      mallId,
      parkId,
      uid: id,
      licensePlate,
      mallName,
    });

    newReservation
      .save()
      .then((reservation) => {
        req.reservation = reservation;
        next();
      })
      .catch(next);
  };

  static getAllReservations(req, res, next) {
    res.status(200).json(req.data);
  }
};

module.exports = ReservationController;
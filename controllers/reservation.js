const Reservation = require('../models/Reservation');

class ReservationController {

  static postCreateReservation(req, res, next) {
    const { 
      parkId,
      mallId,
    } = req.body;
    const { id } = req.authenticated;
    
    const newReservation = new Reservation({
      mallId,
      parkId,
      uid: id,
    });

    newReservation
      .save()
      .then((reservation) => {
        req.reservation = reservation;
        return next();
      })
      .catch(next);
  };

  static getAllReservations(req, res, next) {
    const{ id } = req.authenticated;

    Reservation.find({ uid: id })
      .then((reservations) => {
        res.status(200).json(reservations);
      })
  };
};

module.exports = ReservationController;
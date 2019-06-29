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
      .catch((err) => {
        next(err);
      });
  };


};

module.exports = ReservationController;
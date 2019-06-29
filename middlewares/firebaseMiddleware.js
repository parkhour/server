const { auth, db } = require('../config/firebase');
const moment = require('moment');

exports.firebaseAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    throw new Error('Email/password cannot be empty');
  }

  const { originalUrl } = req;
  const cmd =
    originalUrl === '/login'
      ? 'signInWithEmailAndPassword'
      : 'createUserWithEmailAndPassword';

  auth[cmd](email, password)
    .then(({ user }) => {
      req.uid = user.uid;
      db.ref('/test/user').update({
        [user.uid]: {
          reservations: {
            0: ''
          },
          email,
          location: {
            lat: '',
            long: ''
          }
        }
      });
    })
    .then(() => next())
    .catch(next);
};

exports.firebaseCreateReservation =  async (req, res, next) => {
  const {
    _id,
    uid,
    mallId,
    parkId,
    status,
    createdAt,
  } = req.reservation;

  await db.ref('/test/reservations').update({
   [_id]: {
     mallId,
     parkId,
     uid,
     status,
     createdAt : moment(createdAt).valueOf(),
   },
  })

  await db.ref(`/test/user/${uid}/reservations`).update({
    [_id]: {
      mallId,
      parkId,
      uid,
      status,
      createdAt : moment(createdAt).valueOf(),
    }
  })

 db.ref(`/test/parkingLot/${mallId}/${parkId}`).update({
   reserved: true,
   reservationId: _id,
 })
  .then(() => {
    res.status(201).json(req.reservation)
  })
  .catch(next);
}

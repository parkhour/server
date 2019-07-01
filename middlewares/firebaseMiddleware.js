const moment = require('moment');
const cron = require('cron');
const {CronJob } = cron;
const { auth, db } = require('../config/firebase');
const { setCronTimer } = require('../helpers/timeHelper');

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

exports.firebaseSignOut = (req, res, next) => {
  auth.signOut()
    .then(() => {
      next();
    })
    .catch(next);
}

exports.firebaseCreateReservation =  async (req, res, next) => {
  const {
    _id,
    uid,
    mallId,
    parkId,
    status,
    createdAt,
    licensePlate,
    mallName,
  } = req.reservation;

  await db.ref('/test/reservations').update({
   [_id]: {
     mallId,
     parkId,
     uid,
     status,
     licensePlate,
     mallName,
     createdAt : moment(createdAt).valueOf(),
   },
  })

  await db.ref(`/test/user/${uid}/reservations`).update({
    [_id]: {
      mallId,
      parkId,
      uid,
      status,
      mallName,
      createdAt : moment(createdAt).valueOf(),
    }
  })

 db.ref(`/test/parkingLot/${mallId}/${parkId}`).update({
   reserved: true,
   reservationId: _id,
 })
  .then(() => {
    const jobDate = setCronTimer(new Date(moment(createdAt).valueOf()), 5);

    new CronJob(jobDate, function() {
      this.stop();
    }, async function() {
      try{ 
        const snapshot = await db.ref(`/test/reservations/${_id}`).once('value');
        const confirmationStatus = snapshot.val().status;

       if(confirmationStatus !== 'confirmation' || confirmationStatus !== 'completed') {
        await db.ref(`/test/reservations/${_id}`).update({
          status: 'canceled',
        });

        await db.ref(`/test/parkingLot/${mallId}/${parkId}`).update({
          reserved: false,
          reservationId: '',
        });
       }
        
      } catch(err) {
        next(err);
      }
        console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss", 'job\'s done'));
    }, true, 'Asia/Jakarta');

    res.status(201).json(req.reservation)
  })
  .catch(next);
};

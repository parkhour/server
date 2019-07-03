/*istanbul ignore file */
const moment = require('moment');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');
const { createAccessToken } = require('../helpers/tokenHelper');
const { auth, db } = require('../config/firebase');
const { adminAuth } = require('../config/admin');

const randomEmail = () => {
  return `${Math.random()
    .toString(36)
    .substring(5)}@mail.com`;
};

const createUserToken = () => {
  const testUser = {
    email: randomEmail(),
    password: '123456'
  };

  return new Promise(resolve => {
    auth
      .createUserWithEmailAndPassword(testUser.email, testUser.password)
      .then(({ user }) => {
        const newUser = new User({
          email: testUser.email,
          password: testUser.password,
          firebaseId: user.uid
        });
        return newUser.save();
      })
      .then(user => {
        const token = createAccessToken({
          id: user.firebaseId,
          email: user.email
        });
        resolve([token, user.firebaseId]);
      });
  });
};

const createTestAdmin = () => {
  const data = {
    email: 'admin@parkhour.com',
    password: '123456',
    role: 'admin'
  };
  return new Promise(resolve => {
    const testAdmin = new User(data);
    testAdmin
      .save()
      .then(user => {
        const token = createAccessToken({
          id: user._id,
          role: user.role
        });
        resolve([token, user._id]);
      })
  });
};

const createTestReservation = (userId) => {
  const data = {
    licensePlate: 'AB test CD',
    status: 'confirmed',
    uid: userId,
    mallId: '01',
    mallName: 'sunflower',
    parkId: 1,
  }
  
  const testReservation = new Reservation(data);
  return new Promise(resolve => {
    testReservation.save()
      // .then((reservation) => resolve(reservation))
      .then((reservation) => {
        db.ref('/test/reservations').update({
          [reservation._id]: {
            mallId: reservation.mallId,
            parkId: reservation.parkId,
            uid: reservation.uid,
            status: reservation.status,
            licensePlate: reservation.licensePlate,
            mallName: reservation.mallName,
            createdAt : moment(reservation.createdAt).valueOf(),
          },
        })
        resolve(reservation)
      })
      .catch((err) => resolve(err));
  })
}

const dropUsers = async (done, userId) => {
  User.deleteMany({}).exec();

  try {
    await adminAuth.deleteUser(userId);
    await db.ref(`/test/user/${userId}`).remove();
    done();
  } catch (err) {
    done();
  }
};

const dropAll = async (done, userId, reservationId) => {
  User.deleteMany({}).exec();
  Reservation.deleteMany({}).exec();
  Payment.deleteMany({}).exec();

  try {
    // await db.ref(`/test/reservations/`).set({reserve: 'this'});
    await adminAuth.deleteUser(userId);
    await db.ref(`/test/user/${userId}/reservations/${reservationId}`).remove();
    await db.ref(`/test/reservations/${reservationId}`).remove();
    await db.ref(`/test/user/${userId}`).remove();
    await db
      .ref(`/test/parkingLot/01/1`)
      .update({ reserved: false, reservationId: '' });
    done();
  } catch (err) {
    done();
  }
};

module.exports = {
  randomEmail,
  createTestAdmin,
  createTestReservation,
  createUserToken,
  dropUsers,
  dropAll
};

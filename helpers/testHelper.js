/*istanbul ignore file */
const User = require("../models/User");
const Reservation = require('../models/Reservation');
const { createAccessToken } = require('../helpers/tokenHelper');
const { auth, db } = require("../config/firebase");
const { adminAuth } = require('../config/admin');

const randomEmail = () => {
  return `${Math.random().toString(36).substring(5)}@mail.com`;
};

const createUserToken = () => {
  const testUser = {
    email: randomEmail(),
    password: '123456',
  };

  return new Promise((resolve) => {
    auth
    .createUserWithEmailAndPassword(testUser.email, testUser.password)
    .then(({user}) => {
      const newUser = new User({
        email: testUser.email,
        password: testUser.password,
        firebaseId: user.uid,
      })
      return newUser.save()
    })
    .then((user) => {
      const token = createAccessToken({
        id: user.firebaseId,
        email: user.email,
      })
      resolve([token, user.firebaseId]);
    })
  })
  
};

const dropUsers = async (done, userId) => {
  User.deleteMany({}).exec();
  
  try {
    await adminAuth.deleteUser(userId);
    await db.ref(`/test/user/${userId}`).remove();
    done();
  } catch(err) {
    done();
  }
};

const dropAll = async (done, userId, reservationId) => {
  User.deleteMany({}).exec();
  Reservation.deleteMany({}).exec();
  
  try {
    await adminAuth.deleteUser(userId);
    await db.ref(`/test/user/${userId}/reservations/${reservationId}`).remove();
    await db.ref(`/test/reservations/${reservationId}`).remove();
    await db.ref(`/test/user/${userId}`).remove();
    await db.ref(`/test/parkingLot/01/1`).update({ reserved: false, reservationId: ""});
    done();
  }
  catch(err) {
   done();
  }

}

module.exports = {
  randomEmail,
  createUserToken,
  dropUsers,
  dropAll,
};

const User = require("../models/User");
const Reservation = require('../models/Reservation');
const { createAccessToken } = require('../helpers/tokenHelper');
const { auth, db } = require("../config/firebase");

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

const dropUsers = done => {
  User.deleteMany({})
  .then(() => {
    const user = auth.currentUser;
    return user.delete()
   })
  .then(() => done())
  .catch(() => done());
};

// const dropReservations = (done, userId, reservationId) => {
//   Reservation.deleteMany({})
//     .then(async () => {
//       try {
//         await db.ref(`/test/user/${userId}/reservations/${reservationId}`).remove();
//         await db.ref(`/test/reservations/${reservationId}`).remove();
//         done();
//       }
//       catch(err) {
//         console.log(err);
//       }
//     })
//     .catch(() => { done() })
// };

const dropAll = async (done, userId, reservationId) => {
  User.deleteMany({}).exec();
  Reservation.deleteMany({}).exec();

  try {
    const user = auth.currentUser;

    await user.delete();
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
  createUserToken,
  // dropReservations,
  dropUsers,
  dropAll,
};

const User = require("../models/User");
const { createAccessToken } = require('../helpers/tokenHelper');
const { auth } = require("../config/firebase");

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

module.exports = {
  createUserToken,
  dropUsers,
};

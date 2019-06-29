const { auth } = require("../config/firebase");
const User = require("../models/User");

const { createAccessToken } = require('../helpers/token');

let firstUser = '',
    secondUser = '',
    thirdUser = '';

const randomEmail = () => {
  return `${Math.random().toString(36).substring(5)}@mail.com`;
};

const createTestUsers = () => {
  const testUserOne = new User({
    username: 'userOne',
    email: randomEmail(),
    password: '123',
  });

  const testUserTwo = new User({
    username: 'userTwo',
    email: randomEmail(),
    password: '123',
  });

  const testUserThree = new User({
    username: 'userThree',
    email: randomEmail(),
    password: '123',
  });

  const userOne = testUserOne.save(),
        userTwo = testUserTwo.save(),
        userThree = testUserThree.save();

  return new Promise((resolve, reject) => {
    Promise.all([userOne, userTwo, userThree])
    .then(([userOne, userTwo, userThree]) => {
      let tokens = [];
      let userIds = [];
      let users = [userOne, userTwo, userThree];

      users.forEach((user) => {
        tokens.push(createAccessToken({
          id: user._id,
          email: user.email,
        }));
        userIds.push(user._id);
      });
      [firstUser, secondUser, thirdUser] = [...userIds];
      resolve({tokens, userIds});
    })
  });

};

const dropUsers = done => {
  User.deleteMany({})
  .then(() => {
    const user = auth.currentUser;
    return user.delete()
   })
  .then(() => done());

};

module.exports = {
  createTestUsers,
  dropUsers,
};

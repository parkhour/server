const User = require('../models/User');

const { createAccessToken } = require('../helpers/tokenHelper');
const { verifyPassword } = require('../helpers/entryHelper');

class EntryController {

  static postUserRegister(req, res, next) {
    const {
      email,
      password,
    } = req.body;

    const newUser = new User({
      email,
      password,
      firebaseId: req.uid,
    });

    newUser.save()
      .then((user) => {
        const accessToken = createAccessToken({
          id: req.uid,
          email: user.email
        });

        res.status(201).json({
          token: accessToken,
        });
      })
      .catch(next);
  };

  static postUserLogin(req, res, next) {
    const {
      email,
      password,
    } = req.body;

    User.findOne({ email })
      .then((user) => {
        if(user && verifyPassword(password, user.password)) {
          const accessToken = createAccessToken({
            id: req.uid,
            email: user.email,
          });

          res.status(200).json({
            token: accessToken,
          });
        }
      })
      .catch(next);
  };

};

module.exports = EntryController;

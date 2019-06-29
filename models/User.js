const mongoose = require('mongoose');
const { hashPassword } = require('../helpers/entryHelper');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firebaseId: String,
  email: {
    type:String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  this.password = hashPassword(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports= User;
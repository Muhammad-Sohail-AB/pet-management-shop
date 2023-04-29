const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a value for name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'please provide a value for email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'please provide a value for password'],
    minlength: 8,
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not supported',
    },
    default: 'user',
  },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = new mongoose.model('User', UserSchema);

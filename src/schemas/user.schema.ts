const validator = require('validator');  //eslint-disable-line

module.exports.schema = {
  archieve: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },

  name: { type: String, required: [true, 'Please provide user name'] },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: { type: String, required: [true, 'Please provide a password'] }
};

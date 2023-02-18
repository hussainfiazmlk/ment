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

  password: { type: String, required: [true, 'Please provide a password'] },

  role: {
    type: String,
    enum: ['vistor', 'authenticated', 'admin', 'superadmin'],
    default: 'authenticated'
  }
};

module.exports.permissions = {
  'vistor': {
    'archieve': { read: false },
    'createdAt': { read: false },
    'updatedAt': { read: false },

    "name": {read: true},
    "email": {read: true},
    "password": {read: true},
    "role": {read: true},

  },

  'authenticated': {
    'archieve': { read: false },
    'createdAt': { read: false },
    'updatedAt': { read: false },

    "name": {read: true},
    "email": {read: true},
    "password": {read: false},
    "role": {read: false},
  },

  "admin": {
    'archieve': { read: false },
    'createdAt': { read: true },
    'updatedAt': { read: true },

    "name": {read: true},
    "email": {read: true},
    "password": {read: true},
    "role": {read: true},
  },

  'superadmin': {
    'archieve': { read: false },
    'createdAt': { read: true },
    'updatedAt': { read: true },

    "name": {read: true},
    "email": {read: true},
    "password": {read: true},
    "role": {read: true},
  }
};

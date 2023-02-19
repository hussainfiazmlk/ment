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
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdAt': { read: false, write: false },
    'updatedAt': { read: false, write: false },

    "name": {read: true, write: false},
    "email": {read: true, write: false},
    "password": {read: true, write: false},
    "role": {read: true, write: false},

  },

  'authenticated': {
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdAt': { read: false, write: true },
    'updatedAt': { read: false, write: false },

    "name": {read: true, write: true},
    "email": {read: true, write: true},
    "password": {read: false, write: true},
    "role": {read: false, write: true},
  },

  "admin": {
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdAt': { read: true, write: true },
    'updatedAt': { read: true, write: false },

    "name": {read: true, write: true},
    "email": {read: true, write: true},
    "password": {read: true, write: true},
    "role": {read: true, write: true},
  },

  'superadmin': {
    '_id': {read: true, write: false},
    'archieve': { read: true, write: true },
    'createdAt': { read: true, write: true },
    'updatedAt': { read: true, write: false },

    "name": {read: true, write: true},
    "email": {read: true, write: true},
    "password": {read: true, write: true},
    "role": {read: true, write: true},
  }
};

module.exports.schema = {
  archieve: { type: Boolean, default: false },
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },

  name: { type: String, required: [true, 'A product must have a name'] },
  description: { type: String, required: [true, 'A product must have a description'] },
  price: { type: Number, required: [true, 'A product must have a price'] },
};

module.exports.permission = {
  'vistor': {
    "name": {},
    "description": {},
    "price": {},
  },

  'authenticated': {
    "name": {},
    "description": {},
    "price": {},
  },

  "admin": {
    "name": {},
    "description": {},
    "price": {},
    "createdAt": {},
    "updatedAt": {},
    "createdBy": {},
    "updatedBy": {}
  }
};
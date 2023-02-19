module.exports.schema = {
  archieve: { type: Boolean, default: false },
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },

  name: { type: String, required: [true, 'A product must have a name'] },
  description: { type: String, required: [true, 'A product must have a description'] },
  price: { type: Number, required: [true, 'A product must have a price'] },
  stock: {type: Number}
};

module.exports.permissions = {
  'vistor': {
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdBy': { read: false, write: false },
    'updatedBy': { read: false, write: false },
    'createdAt': { read: false, write: false },
    'updatedAt': { read: false, write: false },
    
    "name": {read: true, write: false},
    "description": {read: true, write: false},
    "price": {read: true, write: false},
  },

  'authenticated': {
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdBy': { read: false, write: true },
    'updatedBy': { read: false, write: false },
    'createdAt': { read: false, write: false },
    'updatedAt': { read: false, write: false },
    
    "name": {read: true, write: true},
    "description": {read: true, write: true},
    "price": {read: true, write: true},
  },

  "admin": {
    '_id': {read: true, write: false},
    'archieve': { read: false, write: false },
    'createdBy': { read: true, write: true },
    'updatedBy': { read: true, write: false },
    'createdAt': { read: true, write: false },
    'updatedAt': { read: true, write: false },
    
    "name": {read: true, write: true},
    "description": {read: true, write: true},
    "price": {read: true, write: true},
  },

};
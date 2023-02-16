module.exports.schema = {
  archieve: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },

  name: { type: String, required: [true, 'A product must have a name'] },
  description: { type: String, required: [true, 'A product must have a description'] },
  price: { type: Number, required: [true, 'A product must have a price'] },
};

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  discountRate: Number,
  stockQuantity: Number,
  brand: String,
  rate: Number,
  isActive: Boolean,
  addedDate: { type: Date, default: Date.now() },
  photos: [
    {
      path: String,
      publicId: String
    }
  ],
  comments: [
    {
      orderId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Order' },
      userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
      name: String,
      description: String,
      rate: Number
    }
  ]
});

const product = mongoose.model('Product', productSchema);

module.exports = product;

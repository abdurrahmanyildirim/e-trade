const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  date: { type: Date, default: Date.now() },
  products: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Product' },
      quantity: Number,
      discountRate: Number,
      price: Number
    }
  ],
  isActive: Boolean,
  status: [
    {
      key: Number,
      desc: String,
      date: { type: Date, default: Date.now() }
    }
  ],
  contactInfo: {
    city: String,
    district: String,
    address: String,
    phone: String
  }
});

const order = mongoose.model('Order', orderSchema);

module.exports = order;

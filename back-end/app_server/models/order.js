const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  userName: String,
  email: String,
  date: { type: Date, default: Date.now() },
  contractsChecked: { type: Boolean, default: true },
  cargo: {
    no: { type: String, default: '' },
    company: { type: String, default: '' }
  },
  products: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Product' },
      name: String,
      quantity: Number,
      brand: String,
      discountRate: Number,
      price: Number,
      photoPath: String,
      comment: {
        rate: Number,
        desc: String
      }
    }
  ],
  isActive: { type: Boolean, default: true },
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

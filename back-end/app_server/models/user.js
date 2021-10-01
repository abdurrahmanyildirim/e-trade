const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, default: 'Client' },
  isActivated: { type: Boolean, default: false }, // Hesabın aktif edilmesi kontrolü
  authType: String,
  cart: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Product' },
      quantity: Number
    }
  ],
  createdDate: { type: Date, default: Date.now() },
  isActive: { type: Boolean, default: true },
  favorites: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Product' }
    }
  ],
  addresses: [
    {
      title: String,
      city: String,
      district: String,
      address: String
    }
  ],
  phones: [
    {
      title: String,
      phone: String
    }
  ]
});

const user = mongoose.model('User', userSchema);

module.exports = user;

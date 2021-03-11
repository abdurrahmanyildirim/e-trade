const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  email: String,
  phone: String,
  desc: String,
  isRead: Boolean,
  sendDate: Date
});

const contact = mongoose.model('Contact', schema);

module.exports = contact;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  message: String,
  type: String,
  route: String,
  id: String,
  stack: String,
  date: { type: Date, default: Date.now() }
});

const log = mongoose.model('Log', schema);

module.exports = log;

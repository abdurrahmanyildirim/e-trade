const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  isActive: Boolean
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;

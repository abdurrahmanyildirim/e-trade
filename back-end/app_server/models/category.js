const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;
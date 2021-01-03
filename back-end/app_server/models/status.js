const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
    key: Number,
    name: String
});

const status = mongoose.model('Status', statusSchema);

module.exports = status;
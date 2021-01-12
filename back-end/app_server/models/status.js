const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
    key: Number,
    desc: String
});

const status = mongoose.model('Status', statusSchema);

module.exports = status;
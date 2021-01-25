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
    photos: [
        {
            path: String,
            publicId: String
        }
    ],
    comments: [
        {
            name: String,
            description: String,
            rate: Number
        }
    ]
});

const product = mongoose.model('Product', productSchema);

module.exports = product;
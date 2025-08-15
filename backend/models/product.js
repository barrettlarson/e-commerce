const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    images: [{
        type: String,
    }],
    brand: {
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        enum: ['new', 'used', 'refurbished'],
        required: true,
    }, 
    category: {
        type: String, 
        enum: ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'power supply', 'cooling', 'cases', 'keyboards', 'keycaps', 'mice', 'monitors', 'accessories'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
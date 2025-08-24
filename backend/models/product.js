const mongoose = require('mongoose');

function toSlug(s) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    images: [{
        type: String,
        required: true,
    }],
    brand: {
        type: String
    },
    description: {
        type: String,
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

productSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();

  let base = toSlug(this.name || '');
  let slug = base || Date.now().toString(36);
  const exists = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
  if (exists) slug = `${base}-${Date.now().toString(36).slice(-4)}`;
  this.slug = slug;
  next();
});

module.exports = mongoose.model('Product', productSchema);
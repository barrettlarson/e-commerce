const product = require('../models/product');

const getAllProducts = async (req, res) => {
    try {
        const products = await product.find({});
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const prod = await product.findById(req.params.id);
        if (!prod) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(prod); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, condition, category, images, brand, slug } = req.body;

        if (!name || !price || !category || !images || images.length === 0) {
            return res.status(400).json({ message: 'Name, price, and category, and images are required.' });
        }

        const priceNum = Number(price);
        if (Number.isNaN(priceNum)) {
            return res.status(400).json({ message: 'Price must be a number.' });
        }

        const makeSlug = s => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const finalSlug = slug && typeof slug === 'string' ? slug : makeSlug(name);

        const newProduct = await product.create({
            name,
            slug: finalSlug,
            images: images || [],
            brand: brand || '',
            description: description || '',
            price: priceNum,
            condition: condition || '',
            category
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeProduct = async (req, res) => {
    try {
        const found = await product.findById(req.params.id);
        if (!found) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const allowed = ['name', 'description', 'price', 'condition', 'category', 'images', 'brand', 'slug'];
        const updates = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) updates[key] = req.body[key];
        }

        if (updates.price !== undefined) {
            const priceNum = Number(updates.price);
            if (Number.isNaN(priceNum)) {
                return res.status(400).json({ message: 'Price must be a number.' });
            }
            updates.price = priceNum;
        }

        if (updates.name && !updates.slug) {
            updates.slug = updates.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }

        const updated = await product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    removeProduct,
    updateProduct
};
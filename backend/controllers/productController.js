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
        const { name, price, condition, category, images } = req.body;
        if (!name || !price || !condition || !category || !images) {
            return res.status(400).json({ message: 'Name, price, and category are required.' });
        }
        const newProduct = await product.create({
            name,
            slug,
            images,
            brand,
            description,
            price,
            condition,
            category,
            createdAt,
            updatedAt,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeProduct = async (req, res) => {
    try {
        const proudct = await product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        await product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await product.getProductByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// TODO: Quality check methods above for consistency and error handling
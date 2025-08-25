const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, removeProduct } = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', removeProduct);

module.exports = router;
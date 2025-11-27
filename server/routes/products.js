const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Create/Update product (admin only - in production, add authentication)
router.post('/', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      message: 'Product saved successfully',
      product: product
    });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving product',
      error: error.message
    });
  }
});

module.exports = router;


const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const products = await db.products.find({});
    const categories = [...new Set(products.map(p => p.category))];
    res.json({ success: true, categories });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, page = 1, limit = 12 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: re }, { description: re }, { brand: re }];
    }

    const sortMap = {
      'price-asc': { price: 1 }, 'price-desc': { price: -1 },
      'rating': { rating: -1 }, 'newest': { createdAt: -1 }, 'name': { name: 1 }
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    let products = await db.products.find(query).sort(sortBy);
    const total = products.length;
    const skip = (Number(page) - 1) * Number(limit);
    products = products.slice(skip, skip + Number(limit));

    res.json({ success: true, products, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const product = await db.products.insert({ _id: id, ...req.body, createdBy: req.user._id, createdAt: now, updatedAt: now });
    res.status(201).json({ success: true, product });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const existing = await db.products.findOne({ _id: req.params.id });
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });
    await db.products.update({ _id: req.params.id }, { $set: { ...req.body, updatedAt: new Date().toISOString() } });
    const product = await db.products.findOne({ _id: req.params.id });
    res.json({ success: true, product });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const n = await db.products.remove({ _id: req.params.id });
    if (!n) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;

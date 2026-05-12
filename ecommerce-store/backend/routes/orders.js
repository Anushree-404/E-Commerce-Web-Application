const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Must be before /:id
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const allOrders = await db.orders.find({});
    const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const statusCounts = {};
    allOrders.forEach(o => { statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1; });
    const ordersByStatus = Object.entries(statusCounts).map(([_id, count]) => ({ _id, count }));
    const totalProducts = await db.products.count({});
    const allProducts = await db.products.find({});
    const lowStock = allProducts.filter(p => p.stock < 5).length;
    const recentOrders = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    // Populate user names
    for (const o of recentOrders) {
      const u = await db.users.findOne({ _id: o.userId });
      o.user = u ? { name: u.name, email: u.email } : null;
    }
    res.json({ success: true, stats: { totalOrders: allOrders.length, totalRevenue, ordersByStatus, totalProducts, lowStock, recentOrders } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await db.orders.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/my/:id', protect, async (req, res) => {
  try {
    const order = await db.orders.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, error: 'No order items' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.products.findOne({ _id: item.product });
      if (!product) return res.status(404).json({ success: false, error: `Product not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });

      orderItems.push({
        productId: product._id,
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity: item.quantity
      });
      subtotal += product.price * item.quantity;
      await db.products.update({ _id: product._id }, { $set: { stock: product.stock - item.quantity } });
    }

    const shippingCost = subtotal >= 5000 ? 0 : 99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

    const allOrders = await db.orders.find({});
    const orderNumber = `ORD-${String(allOrders.length + 1).padStart(6, '0')}`;
    const id = uuidv4();
    const now = new Date().toISOString();

    const order = await db.orders.insert({
      _id: id, orderNumber, userId: req.user._id,
      items: orderItems, shippingAddress,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', orderStatus: 'confirmed',
      subtotal: parseFloat(subtotal.toFixed(2)), shippingCost, tax, total,
      notes: notes || '', createdAt: now, updatedAt: now
    });

    res.status(201).json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let orders = await db.orders.find(status ? { orderStatus: status } : {}).sort({ createdAt: -1 });
    const total = orders.length;
    const skip = (Number(page) - 1) * Number(limit);
    orders = orders.slice(skip, skip + Number(limit));
    // Populate user info
    for (const o of orders) {
      const u = await db.users.findOne({ _id: o.userId });
      o.user = u ? { _id: u._id, name: u.name, email: u.email } : null;
    }
    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await db.orders.findOne({ _id: req.params.id });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    const u = await db.users.findOne({ _id: order.userId });
    order.user = u ? { name: u.name, email: u.email, phone: u.phone } : null;
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(orderStatus))
      return res.status(400).json({ success: false, error: 'Invalid status' });

    const update = { orderStatus, updatedAt: new Date().toISOString() };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') update.deliveredAt = new Date().toISOString();
    if (orderStatus === 'cancelled') {
      update.cancelledAt = new Date().toISOString();
      const order = await db.orders.findOne({ _id: req.params.id });
      if (order) {
        for (const item of order.items) {
          const p = await db.products.findOne({ _id: item.productId || item.product });
          if (p) await db.products.update({ _id: p._id }, { $set: { stock: p.stock + item.quantity } });
        }
      }
    }

    await db.orders.update({ _id: req.params.id }, { $set: update });
    const order = await db.orders.findOne({ _id: req.params.id });
    const u = await db.users.findOne({ _id: order.userId });
    order.user = u ? { name: u.name, email: u.email } : null;
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;

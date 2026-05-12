const express = require('express');
const db = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    let users = await db.users.find({}).sort({ createdAt: -1 });
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      users = users.filter(u => re.test(u.name) || re.test(u.email));
    }
    const safeUsers = users.map(({ password: _, ...u }) => u);
    res.json({ success: true, users: safeUsers, pagination: { total: safeUsers.length } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role))
      return res.status(400).json({ success: false, error: 'Invalid role' });
    await db.users.update({ _id: req.params.id }, { $set: { role } });
    const user = await db.users.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id)
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    const n = await db.users.remove({ _id: req.params.id });
    if (!n) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;

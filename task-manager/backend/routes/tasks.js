const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { tasks } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Helper: build nedb sort object
function buildSort(sort, order) {
  const allowedSort = ['created_at', 'updated_at', 'due_date', 'title', 'priority', 'status'];
  const safeSort = allowedSort.includes(sort) ? sort : 'created_at';
  const safeOrder = order === 'asc' ? 1 : -1;
  return { [safeSort]: safeOrder };
}

// GET /api/tasks/stats/summary — must be before /:id
router.get('/stats/summary', async (req, res) => {
  try {
    const all = await tasks.find({ user_id: req.user.id });
    const now = new Date().toISOString();
    const stats = {
      total: all.length,
      todo: all.filter(t => t.status === 'todo').length,
      in_progress: all.filter(t => t.status === 'in_progress').length,
      done: all.filter(t => t.status === 'done').length,
      high_priority: all.filter(t => t.priority === 'high').length,
      overdue: all.filter(t => t.due_date && t.due_date < now && t.status !== 'done').length
    };
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks
router.get('/', async (req, res) => {
  const { status, priority, search, sort = 'created_at', order = 'desc' } = req.query;

  try {
    const query = { user_id: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: re }, { description: re }];
    }

    const sortObj = buildSort(sort, order);
    const result = await tasks.find(query).sort(sortObj);
    res.json({ tasks: result });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await tasks.findOne({ id: req.params.id, user_id: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const { title, description = '', status = 'todo', priority = 'medium', due_date } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validStatuses = ['todo', 'in_progress', 'done'];
  const validPriorities = ['low', 'medium', 'high'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status value' });
  if (!validPriorities.includes(priority)) return res.status(400).json({ error: 'Invalid priority value' });

  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    const task = {
      _id: id, id,
      user_id: req.user.id,
      title: title.trim(),
      description,
      status,
      priority,
      due_date: due_date || null,
      created_at: now,
      updated_at: now
    };

    await tasks.insert(task);

    if (req.app.locals.broadcast) {
      req.app.locals.broadcast(req.user.id, { type: 'TASK_CREATED', task });
    }

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const existing = await tasks.findOne({ id: req.params.id, user_id: req.user.id });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const { title, description, status, priority, due_date } = req.body;

    const validStatuses = ['todo', 'in_progress', 'done'];
    const validPriorities = ['low', 'medium', 'high'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status value' });
    if (priority && !validPriorities.includes(priority)) return res.status(400).json({ error: 'Invalid priority value' });
    if (title !== undefined && title.trim() === '') return res.status(400).json({ error: 'Title cannot be empty' });

    const updated = {
      title: title !== undefined ? title.trim() : existing.title,
      description: description !== undefined ? description : existing.description,
      status: status || existing.status,
      priority: priority || existing.priority,
      due_date: due_date !== undefined ? (due_date || null) : existing.due_date,
      updated_at: new Date().toISOString()
    };

    await tasks.update({ id: req.params.id, user_id: req.user.id }, { $set: updated });
    const task = await tasks.findOne({ id: req.params.id });

    if (req.app.locals.broadcast) {
      req.app.locals.broadcast(req.user.id, { type: 'TASK_UPDATED', task });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['todo', 'in_progress', 'done'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status required: todo, in_progress, done' });
  }

  try {
    const existing = await tasks.findOne({ id: req.params.id, user_id: req.user.id });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const updated_at = new Date().toISOString();
    await tasks.update({ id: req.params.id, user_id: req.user.id }, { $set: { status, updated_at } });
    const task = await tasks.findOne({ id: req.params.id });

    if (req.app.locals.broadcast) {
      req.app.locals.broadcast(req.user.id, { type: 'TASK_UPDATED', task });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const existing = await tasks.findOne({ id: req.params.id, user_id: req.user.id });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await tasks.remove({ id: req.params.id, user_id: req.user.id });

    if (req.app.locals.broadcast) {
      req.app.locals.broadcast(req.user.id, { type: 'TASK_DELETED', taskId: req.params.id });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

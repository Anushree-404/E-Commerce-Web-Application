import React, { useState, useEffect, useRef } from 'react';
import './TaskModal.css';

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
    // Focus title on open
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [task]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        due_date: form.due_date || null
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="task-modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title">Title <span aria-hidden="true">*</span></label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="What needs to be done?"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={set('description')}
              placeholder="Add more details..."
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" value={form.status} onChange={set('status')}>
                <option value="todo">📋 To Do</option>
                <option value="in_progress">⚡ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={form.priority} onChange={set('priority')}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              value={form.due_date}
              onChange={set('due_date')}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import TaskFilters from '../components/TaskFilters';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Spinner from '../components/Spinner';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, loading, wsStatus, fetchTasks, fetchStats, createTask, updateTask, deleteTask } = useTasks();

  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sort: 'created_at', order: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Re-fetch when filters change
  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    if (filters.order) params.order = filters.order;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
    fetchStats();
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchStats();
    setDeleteConfirm(null);
  };

  const grouped = useMemo(() => {
    const groups = { todo: [], in_progress: [], done: [] };
    tasks.forEach((t) => {
      if (groups[t.status]) groups[t.status].push(t);
    });
    return groups;
  }, [tasks]);

  const columns = [
    { key: 'todo', label: '📋 To Do', color: '#94a3b8' },
    { key: 'in_progress', label: '⚡ In Progress', color: '#f59e0b' },
    { key: 'done', label: '✅ Done', color: '#22c55e' }
  ];

  return (
    <div className="dashboard">
      <Navbar user={user} wsStatus={wsStatus} onNewTask={handleCreate} />

      <main className="dashboard-main">
        <StatsBar stats={stats} />
        <TaskFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="loading-center"><Spinner size={40} /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-icon">📭</div>
            <h3>No tasks found</h3>
            <p>{filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}</p>
            {!filters.search && !filters.status && !filters.priority && (
              <button className="btn-primary-sm" onClick={handleCreate}>+ New Task</button>
            )}
          </div>
        ) : (
          <div className="kanban-board">
            {columns.map(({ key, label, color }) => (
              <div key={key} className="kanban-column">
                <div className="kanban-header" style={{ borderColor: color }}>
                  <span>{label}</span>
                  <span className="kanban-count">{grouped[key].length}</span>
                </div>
                <div className="kanban-cards">
                  {grouped[key].length === 0 ? (
                    <div className="kanban-empty">No tasks here</div>
                  ) : (
                    grouped[key].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => setDeleteConfirm(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog fade-in" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

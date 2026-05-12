import React, { useCallback } from 'react';
import './TaskFilters.css';

export default function TaskFilters({ filters, onChange }) {
  const set = useCallback((field) => (e) => {
    onChange((f) => ({ ...f, [field]: e.target.value }));
  }, [onChange]);

  const clearFilters = () => {
    onChange({ status: '', priority: '', search: '', sort: 'created_at', order: 'desc' });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="task-filters" role="search" aria-label="Filter tasks">
      <div className="filter-search">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={set('search')}
          aria-label="Search tasks"
        />
      </div>

      <div className="filter-selects">
        <select value={filters.status} onChange={set('status')} aria-label="Filter by status">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select value={filters.priority} onChange={set('priority')} aria-label="Filter by priority">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={`${filters.sort}:${filters.order}`} onChange={(e) => {
          const [sort, order] = e.target.value.split(':');
          onChange((f) => ({ ...f, sort, order }));
        }} aria-label="Sort tasks">
          <option value="created_at:desc">Newest First</option>
          <option value="created_at:asc">Oldest First</option>
          <option value="due_date:asc">Due Date ↑</option>
          <option value="due_date:desc">Due Date ↓</option>
          <option value="title:asc">Title A–Z</option>
          <option value="priority:desc">Priority ↓</option>
        </select>

        {hasActiveFilters && (
          <button className="btn-clear" onClick={clearFilters} aria-label="Clear all filters">
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}

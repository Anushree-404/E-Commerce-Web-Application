import React from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import './TaskCard.css';

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '🔴' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '🟡' },
  low:    { label: 'Low',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '🟢' }
};

const STATUS_NEXT = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo'
};

const STATUS_LABEL = {
  todo: '▶ Start',
  in_progress: '✓ Complete',
  done: '↩ Reopen'
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const { updateTaskStatus } = useTasks();
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = task.due_date && task.status !== 'done' && isPast(parseISO(task.due_date));

  const handleStatusToggle = async (e) => {
    e.stopPropagation();
    await updateTaskStatus(task.id, STATUS_NEXT[task.status]);
  };

  const formattedDate = task.due_date
    ? format(parseISO(task.due_date), 'MMM d, yyyy')
    : null;

  return (
    <article
      className={`task-card fade-in ${task.status === 'done' ? 'task-done' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ color: priority.color, background: priority.bg }}
          aria-label={`Priority: ${priority.label}`}
        >
          {priority.icon} {priority.label}
        </span>
        <div className="task-actions">
          <button
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label="Edit task"
            title="Edit"
          >✏️</button>
          <button
            className="icon-btn danger"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete task"
            title="Delete"
          >🗑️</button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-card-footer">
        {formattedDate && (
          <span
            className={`due-date ${isOverdue ? 'overdue' : ''}`}
            aria-label={`Due: ${formattedDate}${isOverdue ? ' (overdue)' : ''}`}
          >
            {isOverdue ? '⚠️' : '📅'} {formattedDate}
          </span>
        )}
        <button
          className="status-btn"
          onClick={handleStatusToggle}
          aria-label={`${STATUS_LABEL[task.status]} task`}
        >
          {STATUS_LABEL[task.status]}
        </button>
      </div>
    </article>
  );
}

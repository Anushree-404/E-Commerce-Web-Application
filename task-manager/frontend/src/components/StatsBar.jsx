import React from 'react';
import './StatsBar.css';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    { label: 'Total', value: stats.total, color: '#818cf8', icon: '📊' },
    { label: 'To Do', value: stats.todo, color: '#94a3b8', icon: '📋' },
    { label: 'In Progress', value: stats.in_progress, color: '#f59e0b', icon: '⚡' },
    { label: 'Done', value: stats.done, color: '#22c55e', icon: '✅' },
    { label: 'High Priority', value: stats.high_priority, color: '#ef4444', icon: '🔴' },
    { label: 'Overdue', value: stats.overdue, color: '#f97316', icon: '⏰' }
  ];

  return (
    <div className="stats-bar" role="region" aria-label="Task statistics">
      {items.map(({ label, value, color, icon }) => (
        <div key={label} className="stat-card">
          <span className="stat-icon" aria-hidden="true">{icon}</span>
          <div className="stat-info">
            <span className="stat-value" style={{ color }}>{value ?? 0}</span>
            <span className="stat-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

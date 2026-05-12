import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ user, wsStatus, onNewTask }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const wsIndicator = {
    connected: { color: '#22c55e', label: 'Live' },
    disconnected: { color: '#f59e0b', label: 'Offline' },
    error: { color: '#ef4444', label: 'Error' }
  }[wsStatus] || { color: '#94a3b8', label: '...' };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-brand">
        <span className="brand-icon">✅</span>
        <span className="brand-name">TaskFlow</span>
      </div>

      <div className="navbar-center">
        <span
          className="ws-badge"
          title={`WebSocket: ${wsStatus}`}
          aria-label={`Connection status: ${wsIndicator.label}`}
        >
          <span className="ws-dot" style={{ background: wsIndicator.color }} />
          {wsIndicator.label}
        </span>
      </div>

      <div className="navbar-actions">
        <button className="btn-new-task" onClick={onNewTask} aria-label="Create new task">
          <span aria-hidden="true">+</span> New Task
        </button>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <span className="avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <span className="username">{user?.username}</span>
            <span aria-hidden="true">▾</span>
          </button>

          {menuOpen && (
            <div className="dropdown" role="menu">
              <div className="dropdown-info">
                <strong>{user?.username}</strong>
                <span>{user?.email}</span>
              </div>
              <hr className="dropdown-divider" />
              <button
                className="dropdown-item danger"
                onClick={logout}
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

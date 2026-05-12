import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          🛍️ <span>ShopZone</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/?category=Electronics" onClick={() => setMobileOpen(false)}>Electronics</Link>
          <Link to="/?category=Clothing" onClick={() => setMobileOpen(false)}>Clothing</Link>
          <Link to="/?category=Books" onClick={() => setMobileOpen(false)}>Books</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label={`Cart with ${cartCount} items`}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(o => !o)}>
                <span className="avatar">{user.name[0].toUpperCase()}</span>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span>▾</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                      {user.role}
                    </span>
                  </div>
                  <hr />
                  {isAdmin && (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                      <Link to="/admin/products" className="dropdown-item" onClick={() => setMenuOpen(false)}>📦 Products</Link>
                      <Link to="/admin/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>📋 Orders</Link>
                      <Link to="/admin/users" className="dropdown-item" onClick={() => setMenuOpen(false)}>👥 Users</Link>
                      <hr />
                    </>
                  )}
                  <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>🧾 My Orders</Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

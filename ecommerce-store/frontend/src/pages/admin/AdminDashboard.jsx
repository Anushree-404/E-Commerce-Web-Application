import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../api/axios';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;

  const statusMap = {};
  stats?.ordersByStatus?.forEach(s => { statusMap[s._id] = s.count; });

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <div className="admin-nav">
          <Link to="/admin/products" className="btn btn-outline">📦 Products</Link>
          <Link to="/admin/orders" className="btn btn-outline">📋 Orders</Link>
          <Link to="/admin/users" className="btn btn-outline">👥 Users</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-value">₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{stats?.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">📦</div>
          <div>
            <div className="stat-value">{stats?.totalProducts || 0}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">⚠️</div>
          <div>
            <div className="stat-value" style={{ color: stats?.lowStock > 0 ? 'var(--danger)' : 'inherit' }}>{stats?.lowStock || 0}</div>
            <div className="stat-label">Low Stock Items</div>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h3>Orders by Status</h3>
          <div className="status-list">
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
              <div key={s} className="status-row">
                <span className="status-name">{s}</span>
                <span className="badge badge-primary">{statusMap[s] || 0}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Recent Orders</h3>
          <div className="recent-orders">
            {stats?.recentOrders?.map(order => (
              <Link key={order._id} to="/admin/orders" className="recent-order">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span>{order.user?.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-primary`}>{order.orderStatus}</span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text2)' }}>
                    {format(new Date(order.createdAt), 'MMM d')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

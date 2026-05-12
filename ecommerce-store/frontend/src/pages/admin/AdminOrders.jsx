import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../api/axios';
import './Admin.css';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'warning', confirmed: 'primary', processing: 'primary', shipped: 'primary', delivered: 'success', cancelled: 'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders', { params: { status: filter, limit: 50 } });
      setOrders(data.orders);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/orders/${id}/status`, { orderStatus: status });
      fetchOrders();
    } finally { setUpdating(null); }
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>📋 Orders</h1>
        <Link to="/admin" className="btn btn-outline">← Dashboard</Link>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className={`btn ${!filter ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('')}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>

        {loading ? <div className="spinner" style={{ margin: '2rem auto' }} /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.user?.name}<br /><small style={{ color: 'var(--text2)' }}>{order.user?.email}</small></td>
                    <td>{order.items?.length} items</td>
                    <td><strong>₹{order.total?.toLocaleString('en-IN')}</strong></td>
                    <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{format(new Date(order.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        style={{ width: 'auto', fontSize: '0.85rem', padding: '0.3rem 0.5rem' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text2)' }}>No orders found</p>}
          </div>
        )}
      </div>
    </div>
  );
}

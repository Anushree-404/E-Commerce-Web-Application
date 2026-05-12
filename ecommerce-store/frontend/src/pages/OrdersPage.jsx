import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/axios';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'primary', processing: 'primary',
  shipped: 'primary', delivered: 'success', cancelled: 'danger'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;

  return (
    <div className="container orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="order-card card">
              <div className="order-header">
                <div>
                  <strong>Order #{order.orderNumber}</strong>
                  <span className="order-date">{format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <span className={`badge badge-${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
              </div>
              <div className="order-items">
                {order.items.slice(0, 3).map(item => (
                  <img key={item._id} src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                ))}
                {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
              </div>
              <div className="order-footer">
                <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <strong>₹{order.total.toFixed(2)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

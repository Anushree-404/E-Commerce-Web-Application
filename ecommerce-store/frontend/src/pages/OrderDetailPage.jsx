import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../api/axios';
import './OrderDetailPage.css';

export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/my/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (!order) return <div className="container" style={{ padding: '2rem' }}>Order not found</div>;

  return (
    <div className="container order-detail-page">
      {location.state?.success && (
        <div className="success-banner">
          ✅ Order placed successfully! Your order number is <strong>{order.orderNumber}</strong>
        </div>
      )}
      <h1>Order #{order.orderNumber}</h1>
      <div className="order-detail-layout">
        <div className="order-main">
          <div className="card">
            <h3>Order Items</h3>
            {order.items.map(item => (
              <div key={item._id} className="order-item">
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />
                <div className="item-details">
                  <strong>{item.name}</strong>
                  <span>Qty: {item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        <div className="order-sidebar">
          <div className="card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>₹{order.shippingCost.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{order.tax.toLocaleString('en-IN')}</span></div>
            <hr />
            <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              <span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="card">
            <h3>Status</h3>
            <p><strong>Order Status:</strong> <span className="badge badge-primary">{order.orderStatus}</span></p>
            <p><strong>Payment:</strong> <span className="badge badge-success">{order.paymentStatus}</span></p>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.trackingNumber && <p><strong>Tracking:</strong> {order.trackingNumber}</p>}
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: '0.8rem' }}>
              Ordered on {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

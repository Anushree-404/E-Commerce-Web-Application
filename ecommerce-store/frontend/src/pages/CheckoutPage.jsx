import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, subtotal, shippingCost, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    paymentMethod: 'card'
  });

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { name: form.name, street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
        paymentMethod: form.paymentMethod
      });
      clearCart();
      navigate(`/orders/${data.order._id}`, { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form card">
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input value={form.street} onChange={set('street')} placeholder="123 Main St" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input value={form.city} onChange={set('city')} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input value={form.state} onChange={set('state')} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code</label>
              <input value={form.zip} onChange={set('zip')} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input value={form.country} onChange={set('country')} required />
            </div>
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Payment Method</h3>
          <div className="payment-options">
            {[['card', '💳 Credit/Debit Card'], ['paypal', '🅿️ PayPal'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
              <label key={val} className={`payment-option ${form.paymentMethod === val ? 'selected' : ''}`}>
                <input type="radio" name="payment" value={val} checked={form.paymentMethod === val} onChange={set('paymentMethod')} />
                {label}
              </label>
            ))}
          </div>

          {error && <div className="error-box">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="order-summary card">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id} className="summary-item">
              <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
              <div>
                <p className="summary-item-name">{item.name}</p>
                <p className="summary-item-qty">Qty: {item.quantity}</p>
              </div>
              <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr style={{ margin: '1rem 0' }} />
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          <hr style={{ margin: '0.8rem 0' }} />
          <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

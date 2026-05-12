import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, cartCount, subtotal, shippingCost, tax, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartCount === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>Add some products to get started</p>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Shopping Cart ({cartCount} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item card">
              <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} />
              <div className="item-info">
                <Link to={`/product/${item._id}`} className="item-name">{item.name}</Link>
                <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                {item.stock < 5 && <span className="badge badge-warning">Only {item.stock} left</span>}
              </div>
              <div className="item-actions">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} aria-label="Increase quantity">+</button>
                </div>
                <p className="item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <button className="btn-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove item">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
          </div>
          {shippingCost > 0 && <p className="free-shipping-note">💡 Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping</p>}
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <strong>Total</strong>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </button>
          <Link to="/" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

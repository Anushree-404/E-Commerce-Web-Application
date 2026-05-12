import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (!product) return null;

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="container product-page">
      <div className="product-layout">
        <div className="product-images">
          <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="main-image" />
        </div>
        <div className="product-details">
          <span className="badge badge-primary">{product.category}</span>
          <h1>{product.name}</h1>
          {product.brand && <p className="brand">{product.brand}</p>}
          <div className="rating">
            <span className="stars">{stars}</span>
            <span>({product.numReviews} reviews)</span>
          </div>
          <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="description">{product.description}</p>
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge badge-danger">✗ Out of Stock</span>
            )}
          </div>
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={() => { addToCart(product, quantity); navigate('/cart'); }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

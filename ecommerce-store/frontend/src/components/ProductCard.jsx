import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="product-card fade-in">
      <Link to={`/product/${product._id}`} className="product-img-link">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        {product.featured && <span className="featured-badge">⭐ Featured</span>}
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`} className="product-name">{product.name}</Link>
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <div className="product-rating">
          <span className="stars" aria-label={`${product.rating} stars`}>{stars}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            className="btn btn-primary add-cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (category) params.category = category;
        if (search) params.search = search;
        if (featured) params.featured = featured;
        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, page, featured]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      {!category && !search && !featured && page === 1 && (
        <div className="hero">
          <div className="container hero-content">
            <h1>Welcome to <span>ShopZone</span></h1>
            <p>Discover thousands of products at unbeatable prices</p>
            <form onSubmit={handleSearch} className="hero-search">
              <input
                type="search"
                placeholder="Search for products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      )}

      <div className="container shop-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="card">
            <h3>Categories</h3>
            <ul className="category-list">
              <li>
                <button
                  className={!category ? 'active' : ''}
                  onClick={() => setParam('category', '')}
                >All Products</button>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    className={category === cat ? 'active' : ''}
                    onClick={() => setParam('category', cat)}
                  >{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Filter</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ width: 'auto' }}
                checked={featured === 'true'}
                onChange={e => setParam('featured', e.target.checked ? 'true' : '')}
              />
              ⭐ Featured only
            </label>
          </div>
        </aside>

        {/* Main */}
        <main className="products-main">
          <div className="products-header">
            <div>
              <h2>
                {category || (search ? `Results for "${search}"` : 'All Products')}
              </h2>
              {pagination.total !== undefined && (
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{pagination.total} products found</p>
              )}
            </div>
            <div className="sort-bar">
              {!category && !search && (
                <form onSubmit={handleSearch} className="inline-search">
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    style={{ width: '180px' }}
                  />
                  <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem 0.8rem' }}>🔍</button>
                </form>
              )}
              <select value={sort} onChange={e => setParam('sort', e.target.value)} style={{ width: 'auto' }}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem' }}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline"
                    disabled={page <= 1}
                    onClick={() => setParam('page', page - 1)}
                  >← Prev</button>
                  <span>Page {page} of {pagination.pages}</span>
                  <button
                    className="btn btn-outline"
                    disabled={page >= pagination.pages}
                    onClick={() => setParam('page', page + 1)}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

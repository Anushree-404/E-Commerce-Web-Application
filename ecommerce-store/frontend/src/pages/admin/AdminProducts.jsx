import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other'];
const EMPTY = { name: '', description: '', price: '', category: 'Electronics', brand: '', stock: '', images: [''], featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { limit: 100, search } });
      setProducts(data.products);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, brand: p.brand || '', stock: p.stock, images: p.images?.length ? p.images : [''], featured: p.featured });
    setError('');
    setModal(true);
  };

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (editing) await api.put(`/products/${editing._id}`, payload);
      else await api.post('/products', payload);
      setModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>📦 Products</h1>
        <div className="admin-nav">
          <Link to="/admin" className="btn btn-outline">← Dashboard</Link>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <input type="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        </div>
        {loading ? <div className="spinner" style={{ margin: '2rem auto' }} /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt={p.name} /></td>
                    <td><strong>{p.name}</strong><br /><small style={{ color: 'var(--text2)' }}>{p.brand}</small></td>
                    <td><span className="badge badge-primary">{p.category}</span></td>
                    <td>₹{p.price.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${p.stock < 5 ? 'badge-danger' : 'badge-success'}`}>{p.stock}</span></td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td>
                      <button className="btn btn-outline" style={{ marginRight: '0.5rem', padding: '0.3rem 0.7rem', fontSize: '0.85rem' }} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.85rem' }} onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave}>
              {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.7rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={set('name')} required /></div>
              <div className="form-group"><label>Description *</label><textarea value={form.description} onChange={set('description')} rows={3} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Price *</label><input type="number" value={form.price} onChange={set('price')} min="0" step="0.01" required /></div>
                <div className="form-group"><label>Stock *</label><input type="number" value={form.stock} onChange={set('stock')} min="0" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Brand</label><input value={form.brand} onChange={set('brand')} /></div>
              </div>
              <div className="form-group"><label>Image URL</label><input value={form.images[0]} onChange={e => setForm(p => ({ ...p, images: [e.target.value] }))} placeholder="https://..." /></div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 'auto' }} checked={form.featured} onChange={set('featured')} />
                  Featured Product
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

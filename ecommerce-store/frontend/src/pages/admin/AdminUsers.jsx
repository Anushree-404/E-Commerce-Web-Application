import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { search, limit: 50 } });
      setUsers(data.users);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    await api.put(`/users/${id}/role`, { role: newRole });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h1>👥 Users</h1>
        <Link to="/admin" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <input type="search" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        </div>
        {loading ? <div className="spinner" style={{ margin: '2rem auto' }} /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ width: 36, height: 36, background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      {u._id !== currentUser._id && (
                        <>
                          <button className="btn btn-outline" style={{ marginRight: '0.5rem', padding: '0.3rem 0.7rem', fontSize: '0.85rem' }} onClick={() => toggleRole(u._id, u.role)}>
                            {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.85rem' }} onClick={() => deleteUser(u._id)}>Delete</button>
                        </>
                      )}
                      {u._id === currentUser._id && <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>You</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

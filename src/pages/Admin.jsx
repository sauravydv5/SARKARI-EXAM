import { useEffect, useState } from 'react';
import { api, CATEGORIES, formatDate, getStoredUser, setAuth } from '../api';

const emptyForm = {
  title: '',
  category: 'latest-job',
  organization: '',
  department: '',
  postName: '',
  totalVacancies: 0,
  qualification: '',
  ageLimit: '',
  applicationFee: '',
  shortDescription: '',
  content: '',
  isFeatured: false,
  importantDates: {
    notificationDate: '',
    startDate: '',
    lastDate: '',
    examDate: '',
    resultDate: '',
  },
  links: {
    applyOnline: '',
    officialNotification: '',
    officialWebsite: '',
    downloadAdmitCard: '',
    checkResult: '',
    answerKey: '',
  },
};

export default function Admin() {
  const [user, setUser] = useState(getStoredUser());
  const [email, setEmail] = useState('admin@sarkariresult.local');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    try {
      const res = await api.adminList({ limit: 100 });
      setPosts(res.data || []);
    } catch (err) {
      if (err.message.toLowerCase().includes('authorized') || err.message.toLowerCase().includes('token')) {
        logout();
      }
    }
  }

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.login(email, password);
      setAuth(res.token, res.user);
      setUser(res.user);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  function logout() {
    setAuth(null, null);
    setUser(null);
    setPosts([]);
  }

  function updateField(path, value) {
    setForm((prev) => {
      if (!path.includes('.')) return { ...prev, [path]: value };
      const [a, b] = path.split('.');
      return { ...prev, [a]: { ...prev[a], [b]: value } };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        totalVacancies: Number(form.totalVacancies) || 0,
      };
      if (editingId) {
        await api.updatePost(editingId, payload);
        setMessage('Post updated successfully.');
      } else {
        await api.createPost(payload);
        setMessage('Post created successfully.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadPosts();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(post) {
    setEditingId(post._id);
    setForm({
      ...emptyForm,
      ...post,
      importantDates: { ...emptyForm.importantDates, ...(post.importantDates || {}) },
      links: { ...emptyForm.links, ...(post.links || {}) },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Deactivate this post?')) return;
    try {
      await api.deletePost(id);
      await loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!user) {
    return (
      <div className="admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && <div className="error-box">{loginError}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Logged in as {user.email}</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>

      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <h2>{editingId ? 'Edit Post' : 'Add New Post'}</h2>
          {editingId && (
            <button
              type="button"
              className="btn btn-sm btn-gold"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
        <div className="panel-body" style={{ padding: 16 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Organization</label>
                <input
                  value={form.organization}
                  onChange={(e) => updateField('organization', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Post Name</label>
                <input
                  value={form.postName}
                  onChange={(e) => updateField('postName', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vacancies</label>
                <input
                  type="number"
                  min="0"
                  value={form.totalVacancies}
                  onChange={(e) => updateField('totalVacancies', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Date</label>
                <input
                  value={form.importantDates.lastDate}
                  onChange={(e) => updateField('importantDates.lastDate', e.target.value)}
                  placeholder="e.g. 15 July 2026"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                value={form.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Content (HTML allowed)</label>
              <textarea
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                style={{ minHeight: 120 }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Apply / Result / Admit Link</label>
                <input
                  value={form.links.applyOnline || form.links.checkResult || form.links.downloadAdmitCard}
                  onChange={(e) => {
                    updateField('links.applyOnline', e.target.value);
                    updateField('links.checkResult', e.target.value);
                    updateField('links.downloadAdmitCard', e.target.value);
                  }}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Official Website</label>
                <input
                  value={form.links.officialWebsite}
                  onChange={(e) => updateField('links.officialWebsite', e.target.value)}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <input
                type="checkbox"
                checked={!!form.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
              />
              Featured post
            </label>

            {message && (
              <div className={message.includes('success') ? 'disclaimer' : 'error-box'} style={{ marginBottom: 12 }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : editingId ? 'Update Post' : 'Create Post'}
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="page-header">
          <h1 style={{ fontSize: '1.25rem' }}>All Posts ({posts.length})</h1>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>
                    <span className="tag">{p.category}</span>
                  </td>
                  <td>{p.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>
                      Edit
                    </button>{' '}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

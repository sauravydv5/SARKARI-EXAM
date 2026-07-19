import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CATEGORIES, categoryMeta, formatDate, getStoredUser, setAuth } from '../api';

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
  isNew: false,
  importantDates: {
    notificationDate: '',
    startDate: '',
    lastDate: '',
    examDate: '',
    resultDate: '',
  },
  links: {
    applyOnline: '',
    importantLink: '',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setForm({ ...emptyForm, importantDates: { ...emptyForm.importantDates }, links: { ...emptyForm.links } });
      setEditingId(null);
      await loadPosts();
      navigate(categoryMeta(payload.category).path);
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
      isNew: Boolean(post.isNew),
      importantDates: { ...emptyForm.importantDates, ...(post.importantDates || {}) },
      links: { ...emptyForm.links, ...(post.links || {}) },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      setMessage('Post deleted successfully.');
      await loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggleStatus(id, isActive) {
    const action = isActive ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${action} this post?`)) return;
    try {
      await api.updatePost(id, { isActive: !isActive });
      await loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  const visiblePosts = posts.filter((post) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const haystack = [
      post.title,
      post.category,
      post.organization,
      post.postName,
      post.shortDescription,
      post.content,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });

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
                <label>Apply Online</label>
                <input
                  value={form.links.applyOnline}
                  onChange={(e) => updateField('links.applyOnline', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Check Result</label>
                <input
                  value={form.links.checkResult}
                  onChange={(e) => updateField('links.checkResult', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Download Admit Card</label>
                <input
                  value={form.links.downloadAdmitCard}
                  onChange={(e) => updateField('links.downloadAdmitCard', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Download Answer Key</label>
                <input
                  value={form.links.answerKey}
                  onChange={(e) => updateField('links.answerKey', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Download Notification</label>
                <input
                  value={form.links.officialNotification}
                  onChange={(e) => updateField('links.officialNotification', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Official Website</label>
                <input
                  value={form.links.officialWebsite}
                  onChange={(e) => updateField('links.officialWebsite', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Important Link</label>
                <input
                  value={form.links.importantLink}
                  onChange={(e) => updateField('links.importantLink', e.target.value)}
                  placeholder="https://..."
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

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <input
                type="checkbox"
                checked={!!form.isNew}
                onChange={(e) => updateField('isNew', e.target.checked)}
              />
              Mark as New
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
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.25rem' }}>All Posts ({visiblePosts.length})</h1>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8, minWidth: 260 }}>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              style={{ flex: 1, minWidth: 180 }}
            />
            <button type="button" className="btn btn-outline" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </form>
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
              {visiblePosts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>
                    <span className="tag">{p.category}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${p.isActive ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleToggleStatus(p._id, p.isActive)}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
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
              {visiblePosts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                    {posts.length === 0 ? 'No posts yet.' : 'No matching posts found.'}
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

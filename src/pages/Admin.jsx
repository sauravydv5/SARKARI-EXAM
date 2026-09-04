import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  FilterX,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { api, CATEGORIES } from '../api';
import useSeo from '../hooks/useSeo';

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const showEditor = false;

  useSeo({ title: 'Admin - Dashboard', description: 'Admin dashboard (noindex)', noIndex: true });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(searchInput.trim().toLowerCase());
    }, 180);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  async function loadPosts() {
    try {
      setLoading(true);
      const res = await api.adminList({ limit: 100 });
      setPosts(res.data || []);
    } catch (err) {
      setMessage(err.message || 'Unable to load posts.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(post) {
    const slug = post.slug || post.id;
    await api.deletePost(slug);
    setPosts((prev) => prev.filter((item) => (item.slug || item.id) !== slug));
    setMessage(`Deleted content: ${post.title}`);
  }

  async function handleToggleInactive(post, inactive = !post.isInactive) {
    const slug = post.slug || post.id;
    await api.setInactive(slug, inactive);
    setPosts((prev) => prev.map((item) => ((item.slug || item.id) === slug ? { ...item, isInactive: inactive } : item)));
    setMessage(`${post.title} is now ${inactive ? 'inactive' : 'active'}.`);
  }

  async function handleToggleNew(post) {
    const slug = post.slug || post.id;
    const nextState = !post.isNew;
    await api.setNew(slug, nextState);
    setPosts((prev) => prev.map((item) => ((item.slug || item.id) === slug ? { ...item, isNew: nextState } : item)));
    setMessage(`${post.title} is now ${nextState ? 'marked as new' : 'no longer marked as new'}.`);
  }

  async function handleMetaChange(post, field, value) {
    const slug = post.slug || post.id;
    const nextValue = field === 'publishedAt' || field === 'lastUpdated'
      ? (value ? `${value}T00:00:00.000Z` : '')
      : value;
    await api.updatePostMeta(slug, { [field]: nextValue });
    setPosts((prev) => prev.map((item) => (
      (item.slug || item.id) === slug ? { ...item, [field]: nextValue } : item
    )));
    setMessage(`${post.title} ${field === 'category' ? 'category' : field === 'publishedAt' ? 'published date' : 'last updated date'} updated.`);
  }

  function dateInputValue(value) {
    return value ? String(value).slice(0, 10) : '';
  }

  function normalizeCategory(value) {
    const raw = String(value || '').toLowerCase().trim();
    const aliases = {
      'latest jobs': 'latest-job',
      latestjob: 'latest-job',
      latest: 'latest-job',
      jobs: 'latest-job',
      'admit card': 'admit-card',
      admitcard: 'admit-card',
      admitcards: 'admit-card',
      'answer key': 'answer-key',
      answerkey: 'answer-key',
      scholarship: 'certificate',
      certificates: 'certificate',
      certificate: 'certificate',
      news: 'important',
    };
    return aliases[raw] || raw.replace(/\s+/g, '-');
  }

  function getCategoryLabel(category) {
    return CATEGORIES.find((item) => normalizeCategory(item.key) === normalizeCategory(category))?.label || category || 'Unknown';
  }

  const visiblePosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const searchable = [post.title, post.category, post.organization, post.postName, post.shortDescription, post.content, getCategoryLabel(post.category)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !term || searchable.includes(term);
      const matchesCategory = categoryFilter === 'all' || normalizeCategory(post.category) === normalizeCategory(categoryFilter);
      const effectiveInactive = Boolean(post.isDeleted || post.isInactive);
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? !effectiveInactive : effectiveInactive);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest':
          return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0);
        case 'az':
          return String(a.title || '').localeCompare(String(b.title || ''));
        case 'za':
          return String(b.title || '').localeCompare(String(a.title || ''));
        case 'newest':
        default:
          return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
      }
    });

    return sorted;
  }, [posts, searchTerm, categoryFilter, statusFilter, sortOrder]);

  function resetFilters() {
    setSearchInput('');
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortOrder('newest');
  }

  function statusBadge(post) {
    if (post.isDeleted) {
      return <span className="admin-badge admin-badge-red">Deleted</span>;
    }
    if (post.isInactive) {
      return <span className="admin-badge admin-badge-red">Inactive</span>;
    }
    return <span className="admin-badge admin-badge-green">Active</span>;
  }

  function statusToggle(post) {
    const isActive = !post.isInactive;

    return (
      <button
        type="button"
        className={`admin-status-toggle ${isActive ? 'is-active' : 'is-inactive'}`}
        role="switch"
        aria-checked={isActive}
        aria-label={`Change status for ${post.title}`}
        onClick={() => handleToggleInactive(post, isActive)}
        disabled={post.isDeleted}
      >
        <span className="admin-status-toggle-track" aria-hidden="true">
          <span className="admin-status-toggle-thumb" />
        </span>
        <span>{isActive ? 'Active' : 'Inactive'}</span>
      </button>
    );
  }

  function categoryBadge(category) {
    const palette = {
      'latest-job': 'admin-badge-blue',
      admission: 'admin-badge-purple',
      result: 'admin-badge-green',
      'admit-card': 'admin-badge-orange',
      'answer-key': 'admin-badge-cyan',
      important: 'admin-badge-red',
      certificate: 'admin-badge-pink',
      syllabus: 'admin-badge-amber',
    };

    return <span className={`admin-badge ${palette[category] || 'admin-badge-slate'}`}>{CATEGORIES.find((item) => item.key === category)?.label || category}</span>;
  }

  return (
    <div className="admin-layout">
      {/* <div className="page-header admin-hero">
        <div>
          <div className="admin-eyebrow">Content Management</div>
          <h1>Admin Dashboard</h1>
          <p>Create, review, and manage content entries with a cleaner workspace for publishing updates.</p>
        </div>
        <button type="button" className="admin-action-btn admin-action-btn-secondary" onClick={() => navigate('/')}>
          <PlusCircle size={16} />
          Back Home
        </button>
      </div> */}

      {showEditor && <section className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card-head">
          <div>
            <h2>{editingId ? 'Edit Existing JSON' : 'Create New JSON'}</h2>
            <p>Generate and preview JSON without changing any backend logic.</p>
          </div>
          {editingId && (
            <button type="button" className="admin-action-btn admin-action-btn-muted" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
        <div className="admin-card-body">
          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={(e) => updateField('category', e.target.value)}>
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
                <input value={form.organization} onChange={(e) => updateField('organization', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Post Name</label>
                <input value={form.postName} onChange={(e) => updateField('postName', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vacancies</label>
                <input type="number" min="0" value={form.totalVacancies} onChange={(e) => updateField('totalVacancies', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input value={form.qualification} onChange={(e) => updateField('qualification', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age Limit</label>
                <input value={form.ageLimit} onChange={(e) => updateField('ageLimit', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Application Fee</label>
                <input value={form.applicationFee} onChange={(e) => updateField('applicationFee', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vacancy Details</label>
                <input value={form.vacancyDetails} onChange={(e) => updateField('vacancyDetails', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Selection Process</label>
                <input value={form.selectionProcess} onChange={(e) => updateField('selectionProcess', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Content (HTML allowed)</label>
              <textarea value={form.content} onChange={(e) => updateField('content', e.target.value)} style={{ minHeight: 120 }} />
            </div>

            <div className="form-group">
              <label>Documents Required</label>
              <textarea value={form.documentsRequired} onChange={(e) => updateField('documentsRequired', e.target.value)} style={{ minHeight: 80 }} />
            </div>

            <div className="form-group">
              <label>How to Apply</label>
              <textarea value={form.howToApply} onChange={(e) => updateField('howToApply', e.target.value)} style={{ minHeight: 80 }} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Apply Online</label>
                <input value={form.links.applyOnline} onChange={(e) => updateField('links.applyOnline', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Check Result</label>
                <input value={form.links.checkResult} onChange={(e) => updateField('links.checkResult', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Download Admit Card</label>
                <input value={form.links.downloadAdmitCard} onChange={(e) => updateField('links.downloadAdmitCard', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Download Answer Key</label>
                <input value={form.links.answerKey} onChange={(e) => updateField('links.answerKey', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Download Notification</label>
                <input value={form.links.officialNotification} onChange={(e) => updateField('links.officialNotification', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Official Website</label>
                <input value={form.links.officialWebsite} onChange={(e) => updateField('links.officialWebsite', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Important Link</label>
                <input value={form.links.importantLink} onChange={(e) => updateField('links.importantLink', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Image Path</label>
                <input value={form.image || ''} onChange={(e) => updateField('image', e.target.value)} placeholder="/uploads/images/..." />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>PDF Path</label>
                <input value={form.pdf || ''} onChange={(e) => updateField('pdf', e.target.value)} placeholder="/uploads/pdfs/..." />
              </div>
              <div className="form-group">
                <label>Published At</label>
                <input value={form.publishedAt || ''} onChange={(e) => updateField('publishedAt', e.target.value)} placeholder="YYYY-MM-DD" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Notification Date</label>
                <input value={form.importantDates.notificationDate} onChange={(e) => updateField('importantDates.notificationDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Online Apply Start Date</label>
                <input value={form.importantDates.startDate} onChange={(e) => updateField('importantDates.startDate', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Last Date</label>
                <input value={form.importantDates.lastDate} onChange={(e) => updateField('importantDates.lastDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Exam Date</label>
                <input value={form.importantDates.examDate} onChange={(e) => updateField('importantDates.examDate', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Result Date</label>
                <input value={form.importantDates.resultDate} onChange={(e) => updateField('importantDates.resultDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Admit Card Date</label>
                <input value={form.importantDates.admitCardDate} onChange={(e) => updateField('importantDates.admitCardDate', e.target.value)} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} />
              Featured post
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <input type="checkbox" checked={!!form.isNew} onChange={(e) => updateField('isNew', e.target.checked)} />
              Mark as New
            </label>

            {message && <div className={message.includes('download') || message.includes('copied') ? 'admin-toast admin-toast-info' : 'admin-toast admin-toast-success'}>{message}</div>}

            <div className="admin-inline-actions">
              <button type="submit" className="admin-action-btn admin-action-btn-primary">Generate JSON</button>
              <button type="button" className="admin-action-btn admin-action-btn-secondary" onClick={handleDownload}>Download JSON</button>
              <button type="button" className="admin-action-btn admin-action-btn-muted" onClick={handleCopy}>Copy JSON</button>
            </div>
          </form>
        </div>
      </section>}

      {showEditor && preview && (
        <section className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-head">
            <h2>Preview</h2>
          </div>
          <div className="panel-body" style={{ padding: 16 }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>{JSON.stringify(preview, null, 2)}</pre>
          </div>
        </section>
      )}

      <section className="admin-card">
        <div className="admin-card-head admin-card-head-stack">
          <div>
            <h2>Content Library</h2>
            <p>Showing {visiblePosts.length} of {posts.length} records</p>
          </div>
          <button type="button" className="admin-action-btn admin-action-btn-muted" onClick={resetFilters}>
            <FilterX size={16} />
            Reset filters
          </button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-toolbar-group">
            <label className="admin-field-label">Category</label>
            <div className="admin-select-wrap">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="admin-toolbar-group">
            <label className="admin-field-label">Status</label>
            <div className="admin-select-wrap">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="admin-toolbar-group admin-toolbar-search">
            <label className="admin-field-label">Search</label>
            <div className="admin-search-wrap">
              <Search size={16} />
              <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by title" />
              {searchInput ? (
                <button type="button" className="admin-icon-button" onClick={() => setSearchInput('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="admin-toolbar-group">
            <label className="admin-field-label">Sort</label>
            <div className="admin-select-wrap">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="admin-summary-row">
          <div className="admin-summary-pill">
            <span>Total</span>
            <strong>{posts.length}</strong>
          </div>
          <div className="admin-summary-pill">
            <span>Active</span>
            <strong>{posts.filter((post) => !Boolean(post.isDeleted || post.isInactive)).length}</strong>
          </div>
          <div className="admin-summary-pill">
            <span>Inactive</span>
            <strong>{posts.filter((post) => Boolean(post.isDeleted || post.isInactive)).length}</strong>
          </div>
          <div className="admin-summary-pill">
            <span>Visible</span>
            <strong>{visiblePosts.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="admin-skeleton-wrap" aria-hidden="true">
            <div className="admin-skeleton-row" />
            <div className="admin-skeleton-row" />
            <div className="admin-skeleton-row" />
          </div>
        ) : (
          <>
            <div className="table-wrap admin-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published On</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePosts.map((p) => (
                    <tr key={p._id || p.id}>
                      <td>
                        <div className="admin-title-cell">
                          <strong>{p.title}</strong>
                          <span>{p.organization || 'Government Organization'}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={p.category || 'latest-job'}
                          onChange={(e) => handleMetaChange(p, 'category', e.target.value)}
                          aria-label={`Change category for ${p.title}`}
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category.key} value={category.key}>{category.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="admin-status-cell">
                          {statusBadge(p)}
                          {statusToggle(p)}
                        </div>
                      </td>
                      <td>
                        <input
                          className="admin-status-select"
                          type="date"
                          value={dateInputValue(p.publishedAt)}
                          onChange={(e) => handleMetaChange(p, 'publishedAt', e.target.value)}
                          aria-label={`Change published date for ${p.title}`}
                        />
                      </td>
                      <td>
                        <input
                          className="admin-status-select"
                          type="date"
                          value={dateInputValue(p.lastUpdated || p.updatedAt)}
                          onChange={(e) => handleMetaChange(p, 'lastUpdated', e.target.value)}
                          aria-label={`Change last updated date for ${p.title}`}
                        />
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button type="button" className="admin-icon-button" onClick={() => handleToggleNew(p)} aria-label={`Toggle new for ${p.title}`}>
                            <CheckCircle2 size={15} />
                          </button>
                          <button type="button" className="admin-icon-button" onClick={() => handleDelete(p)} aria-label={`Delete ${p.title}`}>
                            <Trash2 size={15} />
                          </button>
                          <button type="button" className="admin-icon-button" aria-label={`More actions for ${p.title}`}>
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visiblePosts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="admin-empty-state">
                        <div>
                          <h3>No content found</h3>
                          <p>Try adjusting your filters or add a new entry.</p>
                          <button type="button" className="admin-action-btn admin-action-btn-primary" onClick={resetFilters}>Reset filters</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="admin-mobile-list">
              {visiblePosts.map((p) => (
                <article key={`mobile-${p._id || p.id}`} className="admin-mobile-card">
                  <div className="admin-mobile-card-head">
                    <div>
                      <strong>{p.title}</strong>
                      <span>{p.organization || 'Government Organization'}</span>
                    </div>
                    {statusBadge(p)}
                  </div>
                  <div className="admin-mobile-card-meta">
                    {categoryBadge(p.category)}
                    <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>
                  <div className="admin-actions">
                    {statusToggle(p)}
                    <button type="button" className="admin-icon-button" onClick={() => handleDelete(p)} aria-label={`Delete ${p.title}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
              {visiblePosts.length === 0 && (
                <div className="admin-empty-state admin-empty-state-mobile">
                  <h3>No content found</h3>
                  <p>Try adjusting your filters or add a new entry.</p>
                  <button type="button" className="admin-action-btn admin-action-btn-primary" onClick={resetFilters}>Reset filters</button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

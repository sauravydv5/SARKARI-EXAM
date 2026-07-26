import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CATEGORIES } from '../api';

const emptyForm = {
  title: '',
  category: 'latest-job',
  organization: '',
  department: '',
  postName: '',
  totalVacancies: 0,
  vacancyDetails: '',
  qualification: '',
  ageLimit: '',
  applicationFee: '',
  selectionProcess: '',
  documentsRequired: '',
  howToApply: '',
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
    admitCardDate: '',
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
  image: '/uploads/images/placeholder.svg',
  pdf: '/uploads/pdfs/placeholder.pdf',
  publishedAt: new Date().toISOString(),
  tags: [],
  views: 0,
};

function makeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copyToClipboard(value) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(value);
  }
}

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await api.adminList({ limit: 100 });
      setPosts(res.data || []);
    } catch (err) {
      setMessage(err.message || 'Unable to load posts.');
    }
  }

  function updateField(path, value) {
    setForm((prev) => {
      if (!path.includes('.')) return { ...prev, [path]: value };
      const [a, b] = path.split('.');
      return { ...prev, [a]: { ...prev[a], [b]: value } };
    });
  }

  async function handleDelete(post) {
    const slug = post.slug || post.id;
    await api.deletePost(slug);
    setMessage(`Deleted content: ${post.title}`);
    await loadPosts();
  }

  async function handleToggleInactive(post) {
    const slug = post.slug || post.id;
    const nextState = !post.isInactive;
    await api.setInactive(slug, nextState);
    setMessage(`${post.title} is now ${nextState ? 'inactive' : 'active'}.`);
    await loadPosts();
  }

  async function handleToggleNew(post) {
    const slug = post.slug || post.id;
    const nextState = !post.isNew;
    await api.setNew(slug, nextState);
    setMessage(`${post.title} is now ${nextState ? 'marked as new' : 'no longer marked as new'}.`);
    await loadPosts();
  }

  const payload = useMemo(() => ({
    id: makeSlug(form.title || 'sample-post'),
    slug: makeSlug(form.title || 'sample-post'),
    title: form.title || 'Untitled Update',
    organization: form.organization || 'Government Organization',
    category: form.category || 'latest-job',
    postName: form.postName || form.title || 'Update',
    totalVacancies: Number(form.totalVacancies) || 0,
    vacancyDetails: form.vacancyDetails || '',
    qualification: form.qualification || '',
    ageLimit: form.ageLimit || '',
    applicationFee: form.applicationFee || '',
    selectionProcess: form.selectionProcess || '',
    documentsRequired: form.documentsRequired || '',
    howToApply: form.howToApply || '',
    shortDescription: form.shortDescription || '',
    content: form.content || '',
    isFeatured: Boolean(form.isFeatured),
    isNew: Boolean(form.isNew),
    importantDates: { ...form.importantDates },
    links: { ...form.links },
    image: form.image || '/uploads/images/placeholder.svg',
    pdf: form.pdf || '/uploads/pdfs/placeholder.pdf',
    publishedAt: form.publishedAt || new Date().toISOString(),
    tags: form.tags || [],
    views: Number(form.views || 0) || 0,
  }), [form]);

  function handleGenerate() {
    setPreview(payload);
    setMessage('JSON preview generated.');
  }

  function handleDownload() {
    const filename = `${payload.slug || makeSlug(payload.title)}.json`;
    downloadJson(filename, payload);
    setMessage('JSON downloaded. Move it into the matching content folder to publish it.');
  }

  async function handleCopy() {
    await copyToClipboard(JSON.stringify(payload, null, 2));
    setMessage('JSON copied to clipboard.');
  }

  function startEdit(post) {
    setEditingId(post._id || post.id);
    setForm({
      ...emptyForm,
      title: post.title || '',
      category: post.category || 'latest-job',
      organization: post.organization || '',
      postName: post.postName || '',
      totalVacancies: post.totalVacancies || 0,
      vacancyDetails: post.vacancyDetails || '',
      qualification: post.qualification || '',
      ageLimit: post.ageLimit || '',
      applicationFee: post.applicationFee || '',
      selectionProcess: post.selectionProcess || '',
      documentsRequired: post.documentsRequired || '',
      howToApply: post.howToApply || '',
      shortDescription: post.shortDescription || '',
      content: post.content || '',
      isFeatured: Boolean(post.isFeatured),
      isNew: Boolean(post.isNew),
      importantDates: { ...emptyForm.importantDates, ...(post.importantDates || {}) },
      links: { ...emptyForm.links, ...(post.links || {}) },
      image: post.image || '/uploads/images/placeholder.svg',
      pdf: post.pdf || '/uploads/pdfs/placeholder.pdf',
      publishedAt: post.publishedAt || new Date().toISOString(),
      tags: post.tags || [],
      views: post.views || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(null);
    setMessage('');
  }

  const visiblePosts = posts.filter((post) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const haystack = [post.title, post.category, post.organization, post.postName, post.shortDescription, post.content]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });

  return (
    <div className="admin-layout">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Admin JSON Generator</h1>
          <p>Fill the form, generate JSON, preview it, and download the file for your content folder.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
          Back Home
        </button>
      </div>

      <section className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-head">
          <h2>{editingId ? 'Edit Existing JSON' : 'Create New JSON'}</h2>
          {editingId && (
            <button type="button" className="btn btn-sm btn-gold" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>
        <div className="panel-body" style={{ padding: 16 }}>
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

            {message && <div className={message.includes('download') || message.includes('copied') ? 'disclaimer' : 'error-box'} style={{ marginBottom: 12 }}>{message}</div>}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">Generate JSON</button>
              <button type="button" className="btn btn-outline" onClick={handleDownload}>Download JSON</button>
              <button type="button" className="btn btn-outline" onClick={handleCopy}>Copy JSON</button>
            </div>
          </form>
        </div>
      </section>

      {preview && (
        <section className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-head">
            <h2>Preview</h2>
          </div>
          <div className="panel-body" style={{ padding: 16 }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>{JSON.stringify(preview, null, 2)}</pre>
          </div>
        </section>
      )}

      <section>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Existing Content Files ({visiblePosts.length})</h1>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8, minWidth: 260 }}>
            <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search content..." style={{ flex: 1, minWidth: 180 }} />
            <button type="button" className="btn btn-outline" onClick={() => setSearchTerm('')}>Clear</button>
          </form>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visiblePosts.map((p) => (
                <tr key={p._id || p.id}>
                  <td>{p.title}</td>
                  <td><span className="tag">{p.category}</span></td>
                  <td>
                    {p.isDeleted ? (
                      <span className="tag tag-red">Deleted</span>
                    ) : p.isInactive ? (
                      <>
                        <span className="tag tag-yellow">Inactive</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ marginLeft: 8 }}
                          onClick={() => handleToggleInactive(p)}
                        >
                          Activate
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="tag tag-green">Active</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          style={{ marginLeft: 8 }}
                          onClick={() => handleToggleInactive(p)}
                        >
                          Close
                        </button>
                      </>
                    )}
                  </td>
                  <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${p.isInactive ? 'btn-secondary' : 'btn-warning'}`}
                      onClick={() => handleToggleInactive(p)}
                      disabled={p.isDeleted}
                    >
                      {p.isInactive ? 'Activate' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${p.isNew ? 'btn-warning' : 'btn-secondary'}`}
                      onClick={() => handleToggleNew(p)}
                      disabled={p.isDeleted}
                    >
                      {p.isNew ? 'New On' : 'New Off'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p)}
                      disabled={p.isDeleted}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {visiblePosts.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No content files yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

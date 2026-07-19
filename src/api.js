const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('sr_token');
}

export function setAuth(token, user) {
  if (token) localStorage.setItem('sr_token', token);
  else localStorage.removeItem('sr_token');
  if (user) localStorage.setItem('sr_user', JSON.stringify(user));
  else localStorage.removeItem('sr_user');
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('sr_user') || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || data.errors?.[0]?.msg || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const api = {
  health: () => request('/health'),
  homeSections: () => request('/posts/home/sections'),
  categoryStats: () => request('/posts/stats/categories'),
  listPosts: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v);
    });
    const qs = q.toString();
    return request(`/posts${qs ? `?${qs}` : ''}`);
  },
  getPost: (slug) => request(`/posts/${slug}`),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request('/auth/me'),
  adminList: (params = {}) => {
    const q = new URLSearchParams(params);
    return request(`/posts/admin/all?${q}`);
  },
  createPost: (body) =>
    request('/posts', { method: 'POST', body: JSON.stringify(body) }),
  updatePost: (id, body) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};

export const CATEGORIES = [
  { key: 'latest-job', label: 'Latest Jobs', path: '/latest-jobs', color: '#c62828' },
  { key: 'result', label: 'Results', path: '/results', color: '#1565c0' },
  { key: 'admit-card', label: 'Admit Cards', path: '/admit-cards', color: '#2e7d32' },
  { key: 'answer-key', label: 'Answer Keys', path: '/answer-keys', color: '#6a1b9a' },
  { key: 'syllabus', label: 'Syllabus', path: '/syllabus', color: '#ef6c00' },
  { key: 'admission', label: 'Admission', path: '/admission', color: '#00838f' },
  { key: 'important', label: 'Important', path: '/important', color: '#ad1457' },
  { key: 'certificate', label: 'Certificates', path: '/certificates', color: '#455a64' },
];

export function categoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) || { key, label: key, path: `/${key}` };
}

export function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(d);
  }
}

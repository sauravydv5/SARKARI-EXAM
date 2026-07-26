const contentModules = import.meta.glob('../content/**/*.json', { eager: true, import: 'default' });

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

const CATEGORY_FOLDERS = {
  jobs: 'latest-job',
  results: 'result',
  'admit-cards': 'admit-card',
  'answer-keys': 'answer-key',
  syllabus: 'syllabus',
  admission: 'admission',
  important: 'important',
};

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizePost(raw, sourcePath) {
  if (!raw || typeof raw !== 'object') return null;

  const sourceName = sourcePath.split('/').pop()?.replace(/\.json$/i, '') || 'post';
  const folder = sourcePath.split('/').slice(-2, -1)[0] || '';
  const category = raw.category || CATEGORY_FOLDERS[folder] || 'latest-job';

  return {
    ...raw,
    _id: raw._id || raw.id || toSlug(raw.slug || raw.title || sourceName),
    id: raw.id || raw._id || toSlug(raw.slug || raw.title || sourceName),
    slug: raw.slug || raw.id || toSlug(raw.title || sourceName),
    category,
    title: raw.title || 'Untitled Update',
    organization: raw.organization || 'Government Organization',
    publishedAt: raw.publishedAt || raw.applyStart || raw.lastDate || new Date().toISOString(),
    importantDates: raw.importantDates || {},
    links: raw.links || {},
    tags: raw.tags || [],
    isFeatured: Boolean(raw.isFeatured),
    isNew: Boolean(raw.isNew),
    totalVacancies: Number(raw.totalVacancies || raw.vacancy || 0) || 0,
    vacancyDetails: raw.vacancyDetails || raw.vacancy || '',
    qualification: raw.qualification || '',
    ageLimit: raw.ageLimit || '',
    applicationFee: raw.applicationFee || '',
    selectionProcess: raw.selectionProcess || '',
    documentsRequired: raw.documentsRequired || '',
    howToApply: raw.howToApply || '',
    shortDescription: raw.shortDescription || raw.description || '',
    content: raw.content || '',
    image: raw.image || '',
    pdf: raw.pdf || '',
    views: Number(raw.views || 0) || 0,
  };
}

const POSTS = Object.entries(contentModules)
  .map(([path, module]) => normalizePost(module, path))
  .filter(Boolean)
  .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

function getAllPosts() {
  return POSTS.slice();
}

function getPostsByCategory(category) {
  const key = category || 'latest-job';
  return getAllPosts().filter((post) => post.category === key);
}

function getPostsWithSearch(items, search) {
  const term = (search || '').trim().toLowerCase();
  if (!term) return items;
  return items.filter((post) => {
    const haystack = [post.title, post.organization, post.postName, post.shortDescription, post.content, post.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });
}

function buildPagination(items, page, limit) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 20);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  return {
    page: Math.min(safePage, pages),
    pages,
    total,
    items: items.slice(start, end),
  };
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

export function getJobs() {
  return getPostsByCategory('latest-job');
}

export function getResults() {
  return getPostsByCategory('result');
}

export function getAdmitCards() {
  return getPostsByCategory('admit-card');
}

export function getAnswerKeys() {
  return getPostsByCategory('answer-key');
}

export function getSyllabus() {
  return getPostsByCategory('syllabus');
}

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

export const api = {
  health: () => Promise.resolve({ data: { ok: true } }),
  homeSections: () => {
    const sections = {};
    CATEGORIES.forEach((c) => {
      const posts = getPostsByCategory(c.key).slice(0, 6);
      sections[c.key] = posts;
    });
    sections.certificate = getPostsByCategory('important').slice(0, 6);
    return { data: sections };
  },
  categoryStats: () => {
    const data = CATEGORIES.map((c) => ({ category: c.key, count: getPostsByCategory(c.key).length }));
    return { data };
  },
  listPosts: (params = {}) => {
    const category = params.category;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const search = params.search || '';
    const items = getPostsWithSearch(category ? getPostsByCategory(category) : getAllPosts(), search);
    const paged = buildPagination(items, page, limit);
    return { data: paged.items, pagination: { page: paged.page, pages: paged.pages, total: paged.total } };
  },
  getPost: (slug) => {
    const post = getAllPosts().find((item) => item.slug === slug || item.id === slug);
    if (!post) {
      return { data: null, related: [] };
    }
    const related = getPostsByCategory(post.category)
      .filter((item) => item.slug !== post.slug)
      .slice(0, 4);
    return { data: post, related };
  },
  login: () => Promise.resolve({ token: 'static-token', user: { email: 'admin@sarkariresult.local' } }),
  me: () => Promise.resolve({ user: { email: 'admin@sarkariresult.local' } }),
  adminList: () => ({ data: getAllPosts() }),
  createPost: (body) => Promise.resolve({ data: { ...body, _id: String(Date.now()) } }),
  updatePost: (id, body) => Promise.resolve({ data: { _id: id, ...body } }),
  deletePost: (id) => Promise.resolve({ data: { _id: id } }),
};

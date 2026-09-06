const contentModulesByCategory = {
  'latest-job': {
    ...import.meta.glob('../content/jobs/*.json', { import: 'default' }),
    ...import.meta.glob('../content/upcoming/*.json', { import: 'default' }),
  },
  result: import.meta.glob('../content/results/*.json', { import: 'default' }),
  'admit-card': import.meta.glob('../content/admit-cards/*.json', { import: 'default' }),
  'answer-key': import.meta.glob('../content/answer-keys/*.json', { import: 'default' }),
  syllabus: import.meta.glob('../content/syllabus/*.json', { import: 'default' }),
  admission: import.meta.glob('../content/admission/*.json', { import: 'default' }),
  important: import.meta.glob('../content/important/*.json', { import: 'default' }),
  certificate: import.meta.glob('../content/certificate/*.json', { import: 'default' }),
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

const CATEGORY_FOLDERS = {
  jobs: 'latest-job',
  upcoming: 'latest-job',
  results: 'result',
  'admit-cards': 'admit-card',
  'answer-keys': 'answer-key',
  syllabus: 'syllabus',
  admission: 'admission',
  important: 'important',
  certificate: 'certificate',
};

function toSlug(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseDeadline(value) {
  const raw = String(value || '').trim();
  if (!raw || /see official|to be announced|extended/i.test(raw)) return Number.NaN;
  const dateOnly = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dateOnly) {
    const [, day, month, year] = dateOnly;
    return new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999).getTime();
  }
  const parsed = new Date(raw).getTime();
  if (!Number.isFinite(parsed)) return Number.NaN;
  const date = new Date(parsed);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function normalizePostType(raw, category, title = '') {
  if (raw) {
    const type = String(raw).toLowerCase().replace(/[-\s]+/g, '_');
    if (type === 'online_form') return 'recruitment';
    if (['recruitment', 'result', 'admit_card', 'answer_key', 'syllabus', 'certificate', 'admission', 'notification'].includes(type)) return type;
  }
  if (category === 'latest-job') return 'recruitment';
  if (category === 'admit-card') return 'admit_card';
  if (category === 'answer-key') return 'answer_key';
  if (category === 'result') return 'result';
  if (category === 'syllabus') return 'syllabus';
  if (category === 'certificate') return 'certificate';
  if (category === 'admission') return 'admission';
  if (/\b(result|merit list|scorecard)\b/i.test(title)) return 'result';
  if (/\b(admit card|hall ticket|exam city)\b/i.test(title)) return 'admit_card';
  if (/\b(answer key|response sheet)\b/i.test(title)) return 'answer_key';
  if (/\b(syllabus|exam pattern)\b/i.test(title)) return 'syllabus';
  if (/\b(certificate|registration|download)\b/i.test(title)) return 'certificate';
  return 'notification';
}

function normalizeAsset(value) {
  const asset = String(value || '').trim();
  return /\/placeholder\.(svg|pdf)$/i.test(asset) ? '' : asset;
}

function normalizePost(raw, sourcePath) {
  if (!raw || typeof raw !== 'object') return null;
  const sourceName = sourcePath.split('/').pop()?.replace(/\.json$/i, '') || 'post';
  const folder = sourcePath.split('/').slice(-2, -1)[0] || '';
  const category = raw.category || CATEGORY_FOLDERS[folder] || 'latest-job';
  const postType = normalizePostType(raw.postType, category, raw.title);
  const publishedAt = raw.publishedAt || raw.applyStart || raw.lastDate || new Date().toISOString();
  const lastDate = raw.importantDates?.lastDate || raw.lastDate;
  const lastDateValue = parseDeadline(lastDate);
  const hasPassedDeadline = Number.isFinite(lastDateValue) && lastDateValue < Date.now();

  return {
    ...raw,
    sourcePath,
    _id: raw._id || raw.id || toSlug(raw.slug || raw.title || sourceName),
    id: raw.id || raw._id || toSlug(raw.slug || raw.title || sourceName),
    slug: raw.slug || raw.id || toSlug(raw.title || sourceName),
    category,
    postType,
    title: raw.title || 'Untitled Update',
    organization: raw.organization || 'Government Organization',
    publishedAt,
    importantDates: raw.importantDates || {},
    links: raw.links || {},
    tags: raw.tags || [],
    isFeatured: Boolean(raw.isFeatured),
    isNew: Boolean(raw.isNew),
    statusNote: raw.statusNote || raw.status || '',
    hasPassedDeadline,
    isArchived: Boolean(raw.isArchived) || hasPassedDeadline,
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
    image: normalizeAsset(raw.image),
    pdf: normalizeAsset(raw.pdf),
    views: Number(raw.views || 0) || 0,
  };
}

let POSTS = [];
const categoryPromises = new Map();
let visiblePostsCache = null;

function mergePosts(posts) {
  POSTS = [...POSTS, ...posts.filter(Boolean)].reduce((acc, post) => {
    const key = String(post.slug || post.id || '').trim().toLowerCase();
    if (!key) {
      acc.push(post);
      return acc;
    }
    const existingIndex = acc.findIndex((item) => String(item.slug || item.id || '').trim().toLowerCase() === key);
    if (existingIndex === -1) {
      acc.push(post);
      return acc;
    }
    const existing = acc[existingIndex];
    const existingIsStale = existing.hasPassedDeadline;
    const postIsNewer = new Date(post.publishedAt || 0).getTime() > new Date(existing.publishedAt || 0).getTime();
    const shouldReplace =
      (existing.sourcePath?.includes(' copy') && !post.sourcePath?.includes(' copy')) ||
      (existingIsStale && !post.hasPassedDeadline) ||
      (!existingIsStale && !post.hasPassedDeadline && postIsNewer);
    if (shouldReplace) acc[existingIndex] = post;
    return acc;
  }, []).sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  visiblePostsCache = null;
}

function loadCategory(category) {
  if (categoryPromises.has(category)) return categoryPromises.get(category);
  const modules = contentModulesByCategory[category] || {};
  const promise = Promise.all(
    Object.entries(modules).map(async ([path, loadModule]) => normalizePost(await loadModule(), path))
  ).then((posts) => {
    mergePosts(posts);
    return posts;
  });
  categoryPromises.set(category, promise);
  return promise;
}

function loadPosts() {
  return Promise.all(CATEGORIES.map(({ key }) => loadCategory(key)));
}

const STORAGE_DELETED_POSTS = 'sr_deleted_posts';
const STORAGE_INACTIVE_POSTS = 'sr_inactive_posts';
const STORAGE_NEW_POSTS = 'sr_new_posts';
const STORAGE_POST_OVERRIDES = 'sr_post_overrides';
const CONTENT_CUTOFF_DATE = new Date('2026-08-01T00:00:00.000Z').getTime();
const MINIMUM_CONTENT_WORDS = 30;
const GENERIC_CONTENT_PATTERNS = [
  /is accepting \(or has reopened\) online applications/i,
  /read the detailed advertisement for eligibility/i,
  /apply only through the official portal and read/i,
];

function hasLowQualityContent(post) {
  const plainText = String(post.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  return wordCount < MINIMUM_CONTENT_WORDS || GENERIC_CONTENT_PATTERNS.some((pattern) => pattern.test(plainText));
}

function readStorageList(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorageList(key, list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(new Set(list.filter(Boolean)))));
  } catch {
    // ignore storage errors
  }
}

function readStorageMap(key) {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorageMap(key, map) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

function getStatusLists() {
  return {
    deleted: readStorageList(STORAGE_DELETED_POSTS),
    inactive: readStorageList(STORAGE_INACTIVE_POSTS),
  };
}

function withResolvedFlags(post, storage) {
  const slug = post.slug || post.id;
  const hasExplicitNewOverride = Object.prototype.hasOwnProperty.call(storage.newFlags, slug);
  return {
    ...post,
    ...(storage.overrides[slug] || {}),
    isNew: hasExplicitNewOverride ? Boolean(storage.newFlags[slug]) : Boolean(post.isNew),
    hasExplicitNewOverride,
  };
}

function isRecentPost(post) {
  const dateValue = new Date(post.lastUpdated || post.updatedAt || post.publishedAt || 0).getTime();
  return Number.isFinite(dateValue) && Date.now() - dateValue < 1000 * 60 * 60 * 24 * 14;
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => {
    const priorityValue = Number(b.sortPriority || 0) - Number(a.sortPriority || 0);
    if (priorityValue !== 0) return priorityValue;
    const newValue = Number(Boolean(b.isNew) || isRecentPost(b)) - Number(Boolean(a.isNew) || isRecentPost(a));
    if (newValue !== 0) return newValue;
    return new Date(b.lastUpdated || b.updatedAt || b.publishedAt || 0).getTime() - new Date(a.lastUpdated || a.updatedAt || a.publishedAt || 0).getTime();
  });
}

function getStorageSnapshot() {
  return {
    deleted: new Set(readStorageList(STORAGE_DELETED_POSTS)),
    inactive: new Set(readStorageList(STORAGE_INACTIVE_POSTS)),
    newFlags: readStorageMap(STORAGE_NEW_POSTS),
    overrides: readStorageMap(STORAGE_POST_OVERRIDES),
  };
}

function getAllPosts() {
  const storage = getStorageSnapshot();
  return sortPosts(POSTS.map((post) => withResolvedFlags(post, storage)));
}

function getVisiblePosts() {
  if (visiblePostsCache) return visiblePostsCache;
  const storage = getStorageSnapshot();
  visiblePostsCache = sortPosts(POSTS.map((post) => withResolvedFlags(post, storage)).filter((post) => {
    const publicationDate = new Date(post.publishedAt || 0).getTime();
    const slug = post.slug || post.id;
    return (post.category === 'certificate' || publicationDate >= CONTENT_CUTOFF_DATE) &&
      !hasLowQualityContent(post) && !storage.deleted.has(slug) && !storage.inactive.has(slug) && !post.hasPassedDeadline;
  }));
  return visiblePostsCache;
}

function applySectionNewBadgeLimit(items) {
  const sorted = sortPosts(items);
  let visibleCount = 0;
  return sorted.map((post) => {
    const isRecent = post.publishedAt && Date.now() - new Date(post.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 14;
    const shouldShowBadge = visibleCount < 4 && (Boolean(post.isNew) || (!post.hasExplicitNewOverride && isRecent));
    if (shouldShowBadge) visibleCount += 1;
    return { ...post, showNewBadge: shouldShowBadge };
  });
}

function getPostsByCategory(category) {
  return applySectionNewBadgeLimit(getVisiblePosts().filter((post) => post.category === (category || 'latest-job')));
}

function getPostsWithSearch(items, search) {
  const term = (search || '').trim().toLowerCase();
  if (!term) return items;
  return items.filter((post) => [post.id, post.slug, post.title, post.organization, post.postName, post.shortDescription, post.content, post.category]
    .filter(Boolean).join(' ').toLowerCase().includes(term));
}

function buildPagination(items, page, limit) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 20);
  const pages = Math.max(1, Math.ceil(items.length / safeLimit));
  const start = (safePage - 1) * safeLimit;
  return { page: Math.min(safePage, pages), pages, total: items.length, items: items.slice(start, start + safeLimit) };
}

export function setAuth(token, user) {
  if (token) localStorage.setItem('sr_token', token); else localStorage.removeItem('sr_token');
  if (user) localStorage.setItem('sr_user', JSON.stringify(user)); else localStorage.removeItem('sr_user');
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('sr_user') || 'null'); } catch { return null; }
}

export async function getJobs() { await loadCategory('latest-job'); return getPostsByCategory('latest-job'); }
export async function getResults() { await loadCategory('result'); return getPostsByCategory('result'); }
export async function getAdmitCards() { await loadCategory('admit-card'); return getPostsByCategory('admit-card'); }
export async function getAnswerKeys() { await loadCategory('answer-key'); return getPostsByCategory('answer-key'); }
export async function getSyllabus() { await loadCategory('syllabus'); return getPostsByCategory('syllabus'); }

export function categoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) || { key, label: key, path: `/${key}` };
}

export function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(d);
  }
}

export const api = {
  health: () => Promise.resolve({ data: { ok: true } }),
  initialHomeSections: () => ({ data: { 'latest-job': applySectionNewBadgeLimit(POSTS.filter((post) => post.category === 'latest-job')) } }),
  homeSections: async () => {
    await loadPosts();
    const visible = getVisiblePosts();
    const sections = {};
    CATEGORIES.forEach((category) => {
      sections[category.key] = applySectionNewBadgeLimit(visible.filter((post) => post.category === category.key)).slice(0, 10);
    });
    return { data: sections };
  },
  getFeaturedPosts: async (limit = 8) => {
    await loadPosts();
    const visible = getVisiblePosts();
    const featured = sortPosts(visible.filter((post) => post.isFeatured));
    return { data: (featured.length ? featured : visible).slice(0, Math.max(0, Number(limit) || 8)) };
  },
  categoryStats: async () => {
    await loadPosts();
    const visible = getVisiblePosts();
    return { data: CATEGORIES.map((category) => ({ category: category.key, count: visible.filter((post) => post.category === category.key).length })) };
  },
  listPosts: async (params = {}) => {
    const category = params.category;
    await (category ? loadCategory(category) : loadPosts());
    const items = sortPosts(getPostsWithSearch(category ? getPostsByCategory(category) : getVisiblePosts(), params.search || ''));
    const paged = buildPagination(items, params.page || 1, params.limit || 20);
    return { data: paged.items, pagination: { page: paged.page, pages: paged.pages, total: paged.total } };
  },
  getPost: async (slug) => {
    await loadPosts();
    const post = getVisiblePosts().find((item) => item.slug === slug || item.id === slug);
    if (!post) return { data: null, related: [] };
    return { data: post, related: getPostsByCategory(post.category).filter((item) => item.slug !== post.slug).slice(0, 4) };
  },
  login: () => Promise.resolve({ token: 'static-token', user: { email: 'admin@sarkariresult.local' } }),
  me: () => Promise.resolve({ user: { email: 'admin@sarkariresult.local' } }),
  adminList: async () => {
    await loadPosts();
    const status = getStatusLists();
    return { data: getAllPosts().map((post) => ({ ...post, isDeleted: status.deleted.includes(post.slug || post.id), isInactive: status.inactive.includes(post.slug || post.id) || Boolean(post.hasPassedDeadline) })) };
  },
  createPost: (body) => Promise.resolve({ data: { ...body, _id: String(Date.now()) } }),
  updatePost: (id, body) => Promise.resolve({ data: { _id: id, ...body } }),
  deletePost: (slug) => {
    writeStorageList(STORAGE_DELETED_POSTS, [...readStorageList(STORAGE_DELETED_POSTS), slug]);
    visiblePostsCache = null;
    return Promise.resolve({ data: { slug } });
  },
  setInactive: (slug, inactive = true) => {
    const current = readStorageList(STORAGE_INACTIVE_POSTS);
    writeStorageList(STORAGE_INACTIVE_POSTS, inactive ? [...current, slug] : current.filter((item) => item !== slug));
    visiblePostsCache = null;
    return Promise.resolve({ data: { slug, inactive } });
  },
  setNew: (slug, value = true) => {
    const map = readStorageMap(STORAGE_NEW_POSTS);
    map[slug] = Boolean(value);
    writeStorageMap(STORAGE_NEW_POSTS, map);
    visiblePostsCache = null;
    return Promise.resolve({ data: { slug, value: Boolean(value) } });
  },
  updatePostMeta: (slug, changes) => {
    const map = readStorageMap(STORAGE_POST_OVERRIDES);
    map[slug] = { ...(map[slug] || {}), ...changes };
    writeStorageMap(STORAGE_POST_OVERRIDES, map);
    visiblePostsCache = null;
    return Promise.resolve({ data: { slug, ...changes } });
  },
};

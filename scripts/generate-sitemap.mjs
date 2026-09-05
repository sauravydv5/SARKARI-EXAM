import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const contentDirectory = path.join(rootDirectory, 'content');
const outputFile = path.join(rootDirectory, 'public', 'sitemap.xml');
const siteUrl = 'https://sarkarijobhub.website';
const contentCutoffDate = new Date('2026-08-01T00:00:00.000Z').getTime();
const minimumContentWords = 30;
const genericContentPatterns = [
  /is accepting \(or has reopened\) online applications/i,
  /read the detailed advertisement for eligibility/i,
  /apply only through the official portal and read/i,
];

const categories = [
  ['/latest-jobs', 'daily', '0.9'],
  ['/results', 'daily', '0.9'],
  ['/admit-cards', 'daily', '0.9'],
  ['/answer-keys', 'weekly', '0.8'],
  ['/syllabus', 'weekly', '0.8'],
  ['/admission', 'weekly', '0.8'],
  ['/important', 'weekly', '0.7'],
  ['/certificates', 'monthly', '0.7'],
];

const staticPages = [
  ['/', 'daily', '1.0'],
  ['/faq', 'monthly', '0.6'],
  ['/blog', 'weekly', '0.7'],
  ['/about-us', 'monthly', '0.5'],
  ['/contact', 'monthly', '0.5'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/disclaimer', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/editorial-policy', 'yearly', '0.4'],
  ['/fact-checking-policy', 'yearly', '0.3'],
  ['/correction-policy', 'yearly', '0.3'],
  ['/cookie-policy', 'yearly', '0.3'],
  ['/dmca', 'yearly', '0.3'],
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function isoDate(value) {
  if (!value) return undefined;
  const text = String(value).trim();
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  const match = text.match(/^(\d{1,2})[\s/-]+([A-Za-z]+)[\s/-]+(\d{4})$/);
  if (!match) return undefined;
  const humanDate = new Date(`${match[1]} ${match[2]} ${match[3]} UTC`);
  return Number.isNaN(humanDate.getTime()) ? undefined : humanDate.toISOString().slice(0, 10);
}

function deadlineTimestamp(value) {
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

function hasPassedDeadline(post) {
  const lastDate = post.importantDates?.lastDate || post.lastDate;
  const timestamp = deadlineTimestamp(lastDate);
  return Number.isFinite(timestamp) && timestamp < Date.now();
}

function walkJsonFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkJsonFiles(entryPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) files.push(entryPath);
  }
  return files;
}

function postSlug(post, filePath) {
  const filenameSlug = path.basename(filePath, '.json');
  return String(post.slug || post.id || filenameSlug).trim().toLowerCase();
}

function postLastModified(post, filePath) {
  const fromPost = isoDate(post.updatedAt || post.lastUpdated || post.publishedAt);
  if (fromPost) return fromPost;
  return new Date(fs.statSync(filePath).mtime).toISOString().slice(0, 10);
}

function hasLowQualityContent(post) {
  const plainText = String(post.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  return wordCount < minimumContentWords || genericContentPatterns.some((pattern) => pattern.test(plainText));
}

function urlEntry(urlPath, lastmod, changefreq, priority) {
  const absoluteUrl = `${siteUrl}${urlPath}`;
  if (!/^https:\/\//.test(absoluteUrl)) throw new Error(`Sitemap URL must be HTTPS: ${absoluteUrl}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod) || Number.isNaN(new Date(`${lastmod}T00:00:00Z`).getTime())) {
    throw new Error(`Invalid sitemap lastmod: ${lastmod}`);
  }
  return `  <url>\n    <loc>${escapeXml(absoluteUrl)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = new Map();
const postsBySlug = new Map();
const today = new Date().toISOString().slice(0, 10);

for (const [urlPath, changefreq, priority] of staticPages) {
  entries.set(urlPath, urlEntry(urlPath, today, changefreq, priority));
}

for (const [urlPath, changefreq, priority] of categories) {
  entries.set(urlPath, urlEntry(urlPath, today, changefreq, priority));
}

for (const filePath of walkJsonFiles(contentDirectory)) {
  if (path.basename(filePath).toLowerCase().includes(' copy.json')) continue;
  let post;
  try {
    post = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot parse ${path.relative(rootDirectory, filePath)}: ${error.message}`);
  }
  if (!post || typeof post !== 'object') continue;

  const publicationDate = new Date(post.publishedAt || 0).getTime();
  const isCertificate = post.category === 'certificate';
  if (!isCertificate && (!Number.isFinite(publicationDate) || publicationDate < contentCutoffDate)) continue;
  if (hasLowQualityContent(post)) continue;
  if (hasPassedDeadline(post)) continue;

  const slug = postSlug(post, filePath);
  if (!slug) continue;
  const existing = postsBySlug.get(slug);
  const postDate = new Date(post.publishedAt || 0).getTime();
  if (!existing || postDate > existing.date || (postDate === existing.date && existing.isCopy && !filePath.includes(' copy.json'))) {
    postsBySlug.set(slug, { filePath, date: postDate, isCopy: filePath.includes(' copy.json'), post });
  }
}

for (const [slug, { filePath, post }] of postsBySlug) {
  const urlPath = `/post/${encodeURIComponent(slug)}`;
  entries.set(urlPath, urlEntry(urlPath, postLastModified(post, filePath), 'daily', '0.9'));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...entries.values()].join('\n')}\n</urlset>\n`;
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, sitemap, 'utf8');
console.log(`Generated ${entries.size} URLs in ${path.relative(rootDirectory, outputFile)}`);
